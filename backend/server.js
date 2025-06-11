import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Simpler auto-find free port function
const findFreePort = async (startPort = 3002) => {
  for (let port = startPort; port < startPort + 100; port++) {
    try {
      const server = net.createServer();
      await new Promise((resolve, reject) => {
        server.listen(port, '0.0.0.0', () => {
          server.close();
          resolve(port);
        });
        server.on('error', reject);
      });
      console.log(`🎯 Found free port: ${port}`);
      return port;
    } catch (err) {
      console.log(`⏭️ Port ${port} busy, trying ${port + 1}...`);
      continue;
    }
  }
  throw new Error('No free ports found in range');
};

let PORT;
try {
  PORT = await findFreePort();
} catch (error) {
  console.error('❌ Could not find free port:', error);
  process.exit(1);
}

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

// Serve admin dashboard HTML directly
app.get('/admin*', (req, res) => {
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Admin Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1em; }
        .main-content { padding: 40px; }
        .login-section { text-align: center; margin-bottom: 40px; }
        .login-section.hidden { display: none; }
        .dashboard-section { display: none; }
        .dashboard-section.visible { display: block; }
        .form-group { margin-bottom: 25px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; }
        input, textarea, select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        button { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 12px 24px; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 600; transition: transform 0.2s; margin: 5px; }
        button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3); }
        button.secondary { background: #6b7280; }
        button.danger { background: #ef4444; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #e2e8f0; }
        .stat-number { font-size: 2.5em; font-weight: bold; color: #4f46e5; }
        .stat-label { color: #64748b; font-weight: 500; }
        .projects-list { margin-top: 30px; }
        .project-item { background: #f9fafb; padding: 20px; margin: 15px 0; border-radius: 15px; border-left: 5px solid #4f46e5; transition: transform 0.2s; }
        .project-item:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .project-title { font-size: 1.3em; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .project-meta { display: flex; gap: 15px; margin: 10px 0; flex-wrap: wrap; }
        .project-meta span { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 20px; font-size: 0.9em; }
        .message { padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center; font-weight: 500; }
        .success { background: #dcfce7; color: #166534; border: 2px solid #bbf7d0; }
        .error { background: #fef2f2; color: #dc2626; border: 2px solid #fecaca; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .header h1 { font-size: 2em; } }
        .loading { text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Portfolio Admin</h1>
            <p>Manage your projects with ease</p>
        </div>
        
        <div class="main-content">
            <!-- Login Section -->
            <div id="loginSection" class="login-section">
                <h2>Admin Login</h2>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="loginPassword" placeholder="Enter admin password">
                </div>
                <button onclick="login()">🔐 Login</button>
            </div>
            
            <!-- Dashboard Section -->
            <div id="dashboardSection" class="dashboard-section">
                <div id="message"></div>
                
                <!-- Stats -->
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number" id="totalProjects">-</div>
                        <div class="stat-label">Total Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="publishedProjects">-</div>
                        <div class="stat-label">Published</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="featuredProjects">-</div>
                        <div class="stat-label">Featured</div>
                    </div>
                </div>
                
                <!-- Add Project Form -->
                <h2>✨ Add New Project</h2>
                <form id="projectForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Project Title:</label>
                            <input type="text" id="title" required>
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="category">
                                <option value="ai">AI/Machine Learning</option>
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile</option>
                                <option value="devops">DevOps</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea id="description" rows="3" required placeholder="Brief project description"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Detailed Description:</label>
                        <textarea id="longDescription" rows="5" placeholder="Detailed project description for full view"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Technologies (comma separated):</label>
                            <input type="text" id="tech" placeholder="React, Python, TensorFlow">
                        </div>
                        <div class="form-group">
                            <label>Status:</label>
                            <select id="status">
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="planned">Planned</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>GitHub URL:</label>
                            <input type="url" id="github" placeholder="https://github.com/username/repo">
                        </div>
                        <div class="form-group">
                            <label>Live Demo URL:</label>
                            <input type="url" id="demo" placeholder="https://your-demo.com">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="featured"> Featured Project
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="published" checked> Published
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit">🎯 Add Project</button>
                    <button type="button" onclick="loadProjects()" class="secondary">🔄 Refresh</button>
                    <button type="button" onclick="logout()" class="danger">🚪 Logout</button>
                </form>
                
                <!-- Projects List -->
                <div class="projects-list">
                    <h2>📁 Current Projects</h2>
                    <div id="projectsList" class="loading">Loading projects...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin;
        let authToken = localStorage.getItem('adminToken');
        
        // Check if already logged in
        document.addEventListener('DOMContentLoaded', () => {
            if (authToken) {
                checkAuthStatus();
            }
        });
        
        // Login function
        async function login() {
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch(API_BASE + '/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    authToken = result.token;
                    localStorage.setItem('adminToken', authToken);
                    showDashboard();
                    loadStats();
                    loadProjects();
                    showMessage('Login successful! Welcome back! 🎉', 'success');
                } else {
                    showMessage('Invalid password. Please try again.', 'error');
                }
            } catch (error) {
                showMessage('Login failed: ' + error.message, 'error');
            }
        }
        
        // Check authentication status
        async function checkAuthStatus() {
            try {
                const response = await fetch(API_BASE + '/admin/status', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                if (response.ok) {
                    showDashboard();
                    loadStats();
                    loadProjects();
                } else {
                    localStorage.removeItem('adminToken');
                    authToken = null;
                }
            } catch (error) {
                localStorage.removeItem('adminToken');
                authToken = null;
            }
        }
        
        // Show dashboard
        function showDashboard() {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.add('visible');
        }
        
        // Logout
        function logout() {
            localStorage.removeItem('adminToken');
            authToken = null;
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('dashboardSection').classList.remove('visible');
            document.getElementById('loginPassword').value = '';
            showMessage('Logged out successfully', 'success');
        }
        
        // Load stats
        async function loadStats() {
            try {
                const response = await fetch(API_BASE + '/api/admin/stats', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('totalProjects').textContent = data.stats.totalProjects;
                    document.getElementById('publishedProjects').textContent = data.stats.publishedProjects;
                    document.getElementById('featuredProjects').textContent = data.stats.featuredProjects;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        
        // Form submission
        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const techArray = document.getElementById('tech').value
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);
            
            const projectData = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                longDescription: document.getElementById('longDescription').value,
                tech: techArray,
                status: document.getElementById('status').value,
                github: document.getElementById('github').value,
                demo: document.getElementById('demo').value,
                featured: document.getElementById('featured').checked,
                published: document.getElementById('published').checked
            };
            
            try {
                const response = await fetch(API_BASE + '/api/admin/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: JSON.stringify(projectData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Project added successfully! 🚀', 'success');
                    document.getElementById('projectForm').reset();
                    document.getElementById('published').checked = true; // Reset default
                    loadStats();
                    loadProjects();
                } else {
                    showMessage('Error adding project: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        });
        
        // Load and display projects
        async function loadProjects() {
            try {
                const response = await fetch(API_BASE + '/api/admin/projects', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load projects');
                }
                
                const data = await response.json();
                const projectsList = document.getElementById('projectsList');
                
                if (data.projects.length === 0) {
                    projectsList.innerHTML = '<p style="text-align: center; color: #6b7280;">No projects yet. Add your first project above! 🎯</p>';
                    return;
                }
                
                projectsList.innerHTML = '';
                
                data.projects.forEach(project => {
                    const projectDiv = document.createElement('div');
                    projectDiv.className = 'project-item';
                    
                    const techTags = Array.isArray(project.tech) 
                        ? project.tech.map(t => `<span>${t}</span>`).join('')
                        : (project.tech ? `<span>${project.tech}</span>` : '');
                    
                    projectDiv.innerHTML = `
                        <div class="project-title">${project.title}</div>
                        <p style="color: #4b5563; margin-bottom: 10px;">${project.description}</p>
                        <div class="project-meta">
                            <span style="background: #ddd6fe; color: #7c3aed;">${project.category}</span>
                            <span style="background: #ecfdf5; color: #059669;">${project.status}</span>
                            ${project.featured ? '<span style="background: #fef3c7; color: #d97706;">⭐ Featured</span>' : ''}
                            ${project.published ? '<span style="background: #dcfce7; color: #16a34a;">✅ Published</span>' : '<span style="background: #fef2f2; color: #dc2626;">❌ Draft</span>'}
                        </div>
                        <div class="project-meta">${techTags}</div>
                        <div style="margin-top: 15px;">
                            ${project.github ? `<a href="${project.github}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">📱 GitHub</a>` : ''}
                            ${project.demo ? `<a href="${project.demo}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">🌐 Demo</a>` : ''}
                            <button onclick="deleteProject('${project.id}')" class="danger" style="padding: 6px 12px; font-size: 14px;">🗑️ Delete</button>
                        </div>
                    `;
                    
                    projectsList.appendChild(projectDiv);
                });
            } catch (error) {
                document.getElementById('projectsList').innerHTML = 
                    '<p style="color: #dc2626; text-align: center;">Error loading projects: ' + error.message + '</p>';
            }
        }
        
        // Delete project
        async function deleteProject(id) {
            if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/admin/projects/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Project deleted successfully! 🗑️', 'success');
                    loadStats();
                    loadProjects();
                } else {
                    showMessage('Error deleting project: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        }
        
        // Show messages
        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
            setTimeout(() => messageDiv.innerHTML = '', 5000);
        }
        
        // Handle Enter key in login
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    </script>
</body>
</html>
  `;
  
  res.send(dashboardHTML);
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
  console.log(`🔐 Admin Login: http://localhost:5173/admin/login`);
  console.log(`📊 Dashboard: http://localhost:5173/admin/dashboard`);
  console.log(`\n🔑 Demo Credentials:`);
  console.log(`   Username: admin`);
  console.log(`   Password: selma2024`);
  console.log(`\n✨ Backend ready on port ${PORT}! Frontend should connect automatically.`);
  console.log(`📝 Your Portfolio: http://localhost:5173/\n`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});
