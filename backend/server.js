import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'selma2024';
const JWT_SECRET = process.env.JWT_SECRET || 'magical-portfolio-secret-key-2024';

// 🔧 AGGRESSIVE CORS FIX - Allow all localhost ports
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any localhost or 127.0.0.1 with any port
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow production URLs
    if (origin.includes('vercel.app') || origin.includes('selmabettaieb.com')) {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    console.log('❌ CORS rejected origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.use(express.json());
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  next();
});

// Fixed data file paths
const DATA_DIR = path.join(__dirname, '../public/data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');

// Utility functions
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw new Error(`Failed to read ${path.basename(filePath)}`);
  }
};

const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw new Error(`Failed to write ${path.basename(filePath)}`);
  }
};

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

// =============================================================================
// PUBLIC API ROUTES
// =============================================================================

// Health check with detailed info
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Portfolio backend is running ✨',
    port: PORT,
    cors: 'enabled',
    origin: req.get('Origin') || 'direct-access'
  });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    console.log(`✅ Returning ${data.projects.length} projects`);
    res.json(data);
  } catch (error) {
    console.error('❌ Error in /api/projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    const project = data.projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const data = await readJSONFile(EXPERIENCES_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, projectType } = req.body;
    
    console.log('📧 Contact form submission:', { name, email, message, projectType });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! I\'ll get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// =============================================================================
// ADMIN AUTHENTICATION ROUTES
// =============================================================================

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    console.log('🔐 Admin login attempt');
    
    if (password !== ADMIN_PASSWORD) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    console.log('✅ Admin login successful');
    res.json({ 
      success: true, 
      message: 'Login successful',
      token 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin status check
app.get('/admin/status', authenticateToken, (req, res) => {
  res.json({ 
    authenticated: true, 
    admin: { username: req.user.username }
  });
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// =============================================================================
// ADMIN PROTECTED ROUTES
// =============================================================================

// Get projects for admin (with unpublished)
app.get('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    
    const newProject = {
      id: req.body.id || `project-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.projects.push(newProject);
    await writeJSONFile(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project created successfully', 
      project: newProject 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSONFile(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project updated successfully', 
      project: data.projects[projectIndex] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const data = await readJSONFile(PROJECTS_FILE);
    const initialLength = data.projects.length;
    
    data.projects = data.projects.filter(p => p.id !== req.params.id);
    
    if (data.projects.length === initialLength) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await writeJSONFile(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const projectsData = await readJSONFile(PROJECTS_FILE);
    const experiencesData = await readJSONFile(EXPERIENCES_FILE);
    
    const stats = {
      totalProjects: projectsData.projects.length,
      publishedProjects: projectsData.projects.filter(p => p.published !== false).length,
      featuredProjects: projectsData.projects.filter(p => p.featured).length,
      totalExperiences: experiencesData.experiences ? experiencesData.experiences.length : 0,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder projects
app.post('/api/admin/reorder', authenticateToken, async (req, res) => {
  try {
    const { projectIds } = req.body;
    const data = await readJSONFile(PROJECTS_FILE);
    
    // Reorder projects based on provided IDs
    const reorderedProjects = projectIds.map(id => 
      data.projects.find(p => p.id === id)
    ).filter(Boolean);
    
    data.projects = reorderedProjects;
    await writeJSONFile(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Projects reordered successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server with better error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Portfolio Backend Server Started!`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`🔒 CORS: Enabled for all localhost ports`);
  console.log(`🔐 Admin Login: http://localhost:[frontend-port]/admin/login`);
  console.log(`📊 Dashboard: http://localhost:[frontend-port]/admin/dashboard`);
  console.log(`\n🔑 Demo Credentials:`);
  console.log(`   Username: admin`);
  console.log(`   Password: selma2024`);
  console.log(`\n✨ Ready for magical portfolio management!\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`💡 Try a different port or kill the process using it:`);
    console.log(`   netstat -ano | findstr :${PORT}`);
    console.log(`   taskkill /PID [process-id] /F`);
    process.exit(1);
  } else {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
});
