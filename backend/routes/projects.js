import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsPath = path.join(__dirname, '../../data/projects.json');
const experiencesPath = path.join(__dirname, '../../data/experiences.json');

// Helper function to read projects
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

// Helper function to read experiences
async function readExperiences() {
  try {
    const data = await fs.readFile(experiencesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { experiences: [] };
    }
    throw error;
  }
}

// Get all published projects
router.get('/', async (req, res) => {
  try {
    const data = await readProjects();
    // Filter only published projects for public API
    const publishedProjects = data.projects.filter(project => project.published !== false);
    
    // Sort by featured first, then by creation date
    publishedProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ projects: publishedProjects });
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await readProjects();
    const project = data.projects.find(p => p.id === req.params.id && p.published !== false);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error reading project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get global experiences
router.get('/api/experiences', async (req, res) => {
  try {
    const data = await readExperiences();
    res.json({ experiences: data.experiences });
  } catch (error) {
    console.error('Error reading experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

export default router;