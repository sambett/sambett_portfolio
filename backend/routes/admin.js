import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateProject, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsPath = path.join(__dirname, '../../data/projects.json');
const uploadsPath = path.join(__dirname, '../../data/uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadsPath, { recursive: true });
      cb(null, uploadsPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = process.env.ALLOWED_EXTENSIONS?.split(',') || 
      ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf'];
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`));
    }
  }
});

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Helper functions
async function readProjects() {
  try {
    const data = await fs.readFile(projectsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { projects: [] };
    }
    throw error;
  }
}

async function writeProjects(data) {
  await fs.mkdir(path.dirname(projectsPath), { recursive: true });
  await fs.writeFile(projectsPath, JSON.stringify(data, null, 2));
}

// Get all projects (including drafts)
router.get('/projects', async (req, res) => {
  try {
    const data = await readProjects();
    res.json({ projects: data.projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/projects', validateProject, handleValidationErrors, async (req, res) => {
  try {
    const data = await readProjects();
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      images: req.body.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: req.body.published !== false
    };

    data.projects.push(newProject);
    await writeProjects(data);

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/projects/:id', validateProject, handleValidationErrors, async (req, res) => {
  try {
    const data = await readProjects();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = {
      ...data.projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    data.projects[projectIndex] = updatedProject;
    await writeProjects(data);

    res.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
  try {
    const data = await readProjects();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove associated images
    const project = data.projects[projectIndex];
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        try {
          await fs.unlink(path.join(uploadsPath, image));
        } catch (error) {
          console.warn('Failed to delete image:', image);
        }
      }
    }

    data.projects.splice(projectIndex, 1);
    await writeProjects(data);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let filename = req.file.filename;

    // Optimize images
    if (req.file.mimetype.startsWith('image/')) {
      const optimizedFilename = 'opt-' + filename;
      const optimizedPath = path.join(uploadsPath, optimizedFilename);
      
      await sharp(req.file.path)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Remove original and use optimized version
      await fs.unlink(req.file.path);
      filename = optimizedFilename;
    }

    res.json({
      filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const data = await readProjects();
    const stats = {
      totalProjects: data.projects.length,
      publishedProjects: data.projects.filter(p => p.published !== false).length,
      featuredProjects: data.projects.filter(p => p.featured).length,
      draftProjects: data.projects.filter(p => p.published === false).length,
      categoryBreakdown: {}
    };

    // Count projects by category
    data.projects.forEach(project => {
      stats.categoryBreakdown[project.category] = 
        (stats.categoryBreakdown[project.category] || 0) + 1;
    });

    res.json({ stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Reorder projects
router.post('/reorder', async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'Project IDs must be an array' });
    }

    const data = await readProjects();
    const reorderedProjects = [];

    // Reorder based on provided IDs
    projectIds.forEach(id => {
      const project = data.projects.find(p => p.id === id);
      if (project) {
        reorderedProjects.push(project);
      }
    });

    // Add any projects not in the reorder list
    data.projects.forEach(project => {
      if (!projectIds.includes(project.id)) {
        reorderedProjects.push(project);
      }
    });

    data.projects = reorderedProjects;
    await writeProjects(data);

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

export default router;