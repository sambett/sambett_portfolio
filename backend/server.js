import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://selma-bettaieb.vercel.app', 'https://selmabettaieb.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Data file paths
const DATA_DIR = path.join(__dirname, '../frontend/public/data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');

// Utility function to read JSON files
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Utility function to write JSON files
const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Simple admin authentication (for local use only)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'magical-portfolio-admin-2024';

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Public Routes - Portfolio Data
app.get('/api/projects', async (req, res) => {
  const projects = await readJSONFile(PROJECTS_FILE);
  if (projects) {
    res.json(projects);
  } else {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/experiences', async (req, res) => {
  const experiences = await readJSONFile(EXPERIENCES_FILE);
  if (experiences) {
    res.json(experiences);
  } else {
    res.status(500).json({ error: 'Failed to load experiences' });
  }
});

// Admin Routes - Content Management
app.post('/api/admin/projects', authenticateAdmin, async (req, res) => {
  const projects = await readJSONFile(PROJECTS_FILE);
  if (!projects) {
    return res.status(500).json({ error: 'Failed to load existing projects' });
  }

  const newProject = {
    id: req.body.id || `project-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: req.body.published ?? true
  };

  projects.projects.push(newProject);
  
  const success = await writeJSONFile(PROJECTS_FILE, projects);
  if (success) {
    res.json({ message: 'Project added successfully', project: newProject });
  } else {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const projects = await readJSONFile(PROJECTS_FILE);
  if (!projects) {
    return res.status(500).json({ error: 'Failed to load existing projects' });
  }

  const projectIndex = projects.projects.findIndex(p => p.id === req.params.id);
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.projects[projectIndex] = {
    ...projects.projects[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  const success = await writeJSONFile(PROJECTS_FILE, projects);
  if (success) {
    res.json({ message: 'Project updated successfully', project: projects.projects[projectIndex] });
  } else {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const projects = await readJSONFile(PROJECTS_FILE);
  if (!projects) {
    return res.status(500).json({ error: 'Failed to load existing projects' });
  }

  projects.projects = projects.projects.filter(p => p.id !== req.params.id);
  
  const success = await writeJSONFile(PROJECTS_FILE, projects);
  if (success) {
    res.json({ message: 'Project deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Similar routes for experiences
app.post('/api/admin/experiences', authenticateAdmin, async (req, res) => {
  const experiences = await readJSONFile(EXPERIENCES_FILE);
  if (!experiences) {
    return res.status(500).json({ error: 'Failed to load existing experiences' });
  }

  const newExperience = {
    id: req.body.id || `experience-${Date.now()}`,
    ...req.body
  };

  experiences.experiences.push(newExperience);
  
  const success = await writeJSONFile(EXPERIENCES_FILE, experiences);
  if (success) {
    res.json({ message: 'Experience added successfully', experience: newExperience });
  } else {
    res.status(500).json({ error: 'Failed to save experience' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Magical Portfolio Backend is running ✨'
  });
});

// Catch-all handler for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something magical went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Magical Portfolio Backend running on port ${PORT}`);
  console.log(`🎨 Frontend: http://localhost:3000`);
  console.log(`⚡ API: http://localhost:${PORT}/api`);
  console.log(`🔐 Admin Token: ${ADMIN_TOKEN}`);
});