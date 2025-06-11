import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔧 Auto-find available port starting from 3001
const findAvailablePort = async (startPort = 3001) => {
  for (let port = startPort; port <= startPort + 10; port++) {
    try {
      const { createServer } = await import('net');
      const server = createServer();
      
      return new Promise((resolve, reject) => {
        server.listen(port, () => {
          server.close();
          resolve(port);
        });
        server.on('error', () => {
          // Port is busy, try next one
          resolve(null);
        });
      }).then(result => result || findAvailablePort(port + 1));
    } catch (error) {
      continue;
    }
  }
  throw new Error('No available ports found');
};

const PORT = await findAvailablePort();

// 🔧 Simple CORS - allow localhost development
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    /\.vercel\.app$/,
    /localhost:\d+$/
  ],
  credentials: true
}));

app.use(express.json());

// 📁 Data file paths
const DATA_DIR = path.join(__dirname, '../public/data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');

// 🛠️ Utility functions
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    throw new Error(`Failed to read ${path.basename(filePath)}`);
  }
};

const writeJSON = async (filePath, data) => {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
    throw new Error(`Failed to write ${path.basename(filePath)}`);
  }
};

// ============================================================================
// ROOT ENDPOINT - Welcome Page
// ============================================================================

app.get('/', (req, res) => {
  const welcomeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Backend - Selma Bettaieb</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white;
            line-height: 1.6;
        }
        .container { 
            text-align: center; 
            max-width: 600px; 
            padding: 40px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px; 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 { 
            font-size: 3rem; 
            margin-bottom: 20px; 
            background: linear-gradient(45deg, #fff, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
        }
        .subtitle { 
            font-size: 1.2rem; 
            margin-bottom: 30px; 
            opacity: 0.9; 
        }
        .status { 
            display: inline-block; 
            background: #10b981; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: 600; 
            margin-bottom: 30px;
            font-size: 0.9rem;
        }
        .port-info {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 10px 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .links { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin-top: 30px; 
        }
        .link { 
            display: block; 
            padding: 15px 20px; 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 12px; 
            text-decoration: none; 
            color: white; 
            transition: all 0.3s ease;
            font-weight: 500;
        }
        .link:hover { 
            background: rgba(255,255,255,0.2); 
            transform: translateY(-2px); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .api-list { 
            text-align: left; 
            background: rgba(0,0,0,0.2); 
            padding: 20px; 
            border-radius: 12px; 
            margin-top: 30px; 
        }
        .api-list h3 { 
            margin-bottom: 15px; 
            color: #a78bfa; 
        }
        .api-list code { 
            display: block; 
            padding: 5px 0; 
            font-family: 'SF Mono', Monaco, monospace; 
            font-size: 0.9rem; 
            opacity: 0.9; 
        }
        .footer { 
            margin-top: 30px; 
            opacity: 0.7; 
            font-size: 0.9rem; 
        }
        @media (max-width: 600px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 2.5rem; }
            .links { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Portfolio Backend</h1>
        <p class="subtitle">Enhanced Content Management System</p>
        <div class="status">🟢 Server Running</div>
        
        <div class="port-info">
            🔌 Auto-Selected Port: ${PORT}
        </div>
        
        <p>Backend server for <strong>Selma Bettaieb's AI Portfolio</strong> - managing projects, global experiences, and skills with full CRUD operations.</p>
        
        <div class="links">
            <a href="/admin" class="link">🔧 Admin Panel</a>
            <a href="/api/health" class="link">📊 API Health</a>
            <a href="/api/projects" class="link">📁 Projects API</a>
            <a href="/api/stats" class="link">📈 Statistics</a>
        </div>
        
        <div class="api-list">
            <h3>🔗 Available Endpoints</h3>
            <code>GET  /api/projects - Get all projects</code>
            <code>GET  /api/experiences - Get global experiences</code>
            <code>GET  /api/skills - Get skills constellation</code>
            <code>POST /api/add-project - Add new project</code>
            <code>PUT  /api/update-project/:id - Update project</code>
            <code>POST /api/add-experience - Add experience</code>
            <code>POST /api/add-skill - Add skill</code>
            <code>GET  /api/stats - Portfolio statistics</code>
        </div>
        
        <div class="footer">
            <p>✨ Enhanced Backend • Auto-Port Selection • Full CRUD Support</p>
            <p>Port: ${PORT} • Time: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(welcomeHTML);
});

// ============================================================================
// PUBLIC API ROUTES (Keep frontend working exactly as before)
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: '🚀 Enhanced Portfolio Backend',
    version: '2.0.0',
    port: PORT,
    features: ['Projects', 'Experiences', 'Skills', 'Update Support', 'Auto-Port']
  });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const data = await readJSON(PROJECTS_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJSON(PROJECTS_FILE);
    const project = data.projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const data = await readJSON(EXPERIENCES_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get skills
app.get('/api/skills', async (req, res) => {
  try {
    const data = await readJSON(SKILLS_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, projectType } = req.body;
    console.log('📧 Contact form:', { name, email, message, projectType });
    
    res.json({ 
      success: true, 
      message: 'Thank you! I\'ll get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============================================================================
// CONTENT MANAGEMENT - PROJECTS
// ============================================================================

// Add new project
app.post('/api/add-project', async (req, res) => {
  try {
    const data = await readJSON(PROJECTS_FILE);
    
    const newProject = {
      id: req.body.id || `project-${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'Other',
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [req.body.techStack].filter(Boolean),
      githubUrl: req.body.githubUrl || '',
      demoUrl: req.body.demoUrl || '',
      impact: req.body.impact || '',
      featured: Boolean(req.body.featured),
      published: req.body.published !== false,
      color: req.body.color || 'blue', // Default to blue if no color specified
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: req.body.images || []
    };
    
    data.projects.unshift(newProject);
    await writeJSON(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project added successfully!', 
      project: newProject 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.put('/api/update-project/:id', async (req, res) => {
  try {
    const data = await readJSON(PROJECTS_FILE);
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Update project while preserving existing data
    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...req.body,
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [req.body.techStack].filter(Boolean),
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project updated successfully!', 
      project: data.projects[projectIndex] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project  
app.delete('/api/delete-project/:id', async (req, res) => {
  try {
    const data = await readJSON(PROJECTS_FILE);
    const initialLength = data.projects.length;
    
    data.projects = data.projects.filter(p => p.id !== req.params.id);
    
    if (data.projects.length === initialLength) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await writeJSON(PROJECTS_FILE, data);
    
    res.json({ 
      success: true, 
      message: 'Project deleted successfully!' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Portfolio statistics
app.get('/api/stats', async (req, res) => {
  try {
    const projectsData = await readJSON(PROJECTS_FILE);
    const experiencesData = await readJSON(EXPERIENCES_FILE);
    const skillsData = await readJSON(SKILLS_FILE);
    
    const totalSkills = skillsData.skillCategories.reduce((total, cat) => total + cat.skills.length, 0);
    
    const stats = {
      totalProjects: projectsData.projects.length,
      publishedProjects: projectsData.projects.filter(p => p.published !== false).length,
      featuredProjects: projectsData.projects.filter(p => p.featured).length,
      totalExperiences: experiencesData.experiences?.length || 0,
      totalSkills: totalSkills,
      skillCategories: skillsData.skillCategories.length,
      categories: [...new Set(projectsData.projects.map(p => p.category))],
      technologies: [...new Set(projectsData.projects.flatMap(p => p.techStack))].sort(),
      countries: experiencesData.experiences?.map(e => e.country) || [],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simplified admin panel (focusing on projects for now)
app.get('/admin', (req, res) => {
  const adminHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Admin - Port ${PORT}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%); 
            min-height: 100vh; 
            color: #e2e8f0; 
            line-height: 1.6; 
        }
        .navbar { 
            background: rgba(15, 23, 42, 0.8); 
            backdrop-filter: blur(20px); 
            padding: 1rem 0; 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
            position: sticky; 
            top: 0; 
            z-index: 100; 
        }
        .nav-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .nav-title { 
            font-size: 1.5rem; 
            font-weight: 700; 
            background: linear-gradient(45deg, #60a5fa, #c084fc); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
        }
        .port-badge {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem; 
        }
        .form-section { 
            background: rgba(255,255,255,0.05); 
            backdrop-filter: blur(20px); 
            padding: 2rem; 
            border-radius: 16px; 
            border: 1px solid rgba(255,255,255,0.1); 
            margin-bottom: 2rem; 
        }
        .form-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 1.5rem; 
        }
        .form-group { 
            margin-bottom: 1.5rem; 
        }
        label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 600; 
            color: #cbd5e1; 
        }
        input, textarea, select { 
            width: 100%; 
            padding: 0.75rem; 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 8px; 
            color: #e2e8f0; 
            font-size: 0.9rem; 
            transition: all 0.3s; 
        }
        input:focus, textarea:focus, select:focus { 
            outline: none; 
            border-color: #60a5fa; 
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2); 
        }
        textarea { 
            resize: vertical; 
            min-height: 100px; 
        }
        button { 
            background: linear-gradient(45deg, #3b82f6, #8b5cf6); 
            color: white; 
            padding: 0.75rem 1.5rem; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600; 
            transition: all 0.3s; 
            margin: 0.25rem; 
        }
        button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); 
        }
        button.secondary { background: #64748b; }
        button.danger { background: #ef4444; }
        .checkbox-group { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
        }
        .checkbox-group input { width: auto; }
        .message { 
            padding: 1rem; 
            border-radius: 8px; 
            margin: 1rem 0; 
            font-weight: 500; 
        }
        .success { 
            background: rgba(34, 197, 94, 0.2); 
            color: #4ade80; 
            border: 1px solid rgba(34, 197, 94, 0.3); 
        }
        .error { 
            background: rgba(239, 68, 68, 0.2); 
            color: #f87171; 
            border: 1px solid rgba(239, 68, 68, 0.3); 
        }
        .items-list { 
            display: grid; 
            gap: 1rem; 
            margin-top: 2rem; 
        }
        .item-card { 
            background: rgba(255,255,255,0.05); 
            padding: 1.5rem; 
            border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.1); 
            transition: all 0.3s; 
        }
        .item-card:hover { 
            background: rgba(255,255,255,0.08); 
            transform: translateY(-2px); 
        }
        .item-title { 
            font-size: 1.25rem; 
            font-weight: 700; 
            margin-bottom: 0.5rem; 
            color: #f1f5f9; 
        }
        .item-meta { 
            display: flex; 
            gap: 0.75rem; 
            margin: 0.75rem 0; 
            flex-wrap: wrap; 
        }
        .item-tag { 
            padding: 0.25rem 0.75rem; 
            background: rgba(96, 165, 250, 0.2); 
            color: #93c5fd; 
            border-radius: 12px; 
            font-size: 0.8rem; 
            border: 1px solid rgba(96, 165, 250, 0.3); 
        }
        .item-actions { 
            margin-top: 1rem; 
            display: flex; 
            gap: 0.5rem; 
            flex-wrap: wrap; 
        }
        .loading { text-align: center; color: #94a3b8; padding: 2rem; }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 1rem; 
            margin-bottom: 2rem; 
        }
        .stat-card { 
            background: rgba(255,255,255,0.05); 
            padding: 1.5rem; 
            border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.1); 
            text-align: center; 
        }
        .stat-number { 
            font-size: 2rem; 
            font-weight: 700; 
            color: #60a5fa; 
            margin-bottom: 0.5rem; 
        }
        .stat-label { color: #94a3b8; font-weight: 500; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-title">🚀 Portfolio Admin</div>
            <div class="port-badge">Port: ${PORT}</div>
        </div>
    </nav>

    <div class="container">
        <div id="message"></div>
        
        <!-- Stats Overview -->
        <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
                <div class="stat-number" id="totalProjects">-</div>
                <div class="stat-label">Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="featuredProjects">-</div>
                <div class="stat-label">Featured</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalExperiences">-</div>
                <div class="stat-label">Experiences</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalSkills">-</div>
                <div class="stat-label">Skills</div>
            </div>
        </div>

        <!-- Project Management -->
        <div class="form-section">
            <h2 style="margin-bottom: 1.5rem; color: #f1f5f9;">✨ Add/Edit Project</h2>
            <form id="projectForm">
                <input type="hidden" id="projectId">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Project Title *</label>
                        <input type="text" id="title" required placeholder="e.g., AI Assistant App">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="category">
                            <option value="AI">AI/Machine Learning</option>
                            <option value="Optimization">Optimization</option>
                            <option value="Social">Social Impact</option>
                            <option value="Sustainability">Sustainability</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Description *</label>
                    <textarea id="description" required placeholder="Brief description of what this project does..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Impact Statement</label>
                    <textarea id="impact" placeholder="What problem does this solve? What's the result?"></textarea>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Technologies (comma-separated)</label>
                        <input type="text" id="tech" placeholder="React, Python, TensorFlow">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL</label>
                        <input type="url" id="github" placeholder="https://github.com/username/repo">
                    </div>
                </div>
                
                <div class="form-grid">
                <div class="form-group">
                <label>Demo URL</label>
                <input type="url" id="demo" placeholder="https://your-demo.com">
                </div>
                <div class="form-group">
                <label>Project Color Theme</label>
                <select id="projectColor">
                <option value="blue">💙 Blue - Tech & AI</option>
                    <option value="purple">💜 Purple - Innovation</option>
                    <option value="green">💚 Green - Sustainability</option>
                <option value="red">❤️ Red - Social Impact</option>
                <option value="orange">🧡 Orange - Creative</option>
                    <option value="cyan">💙 Cyan - Data & Analytics</option>
                        <option value="pink">💗 Pink - Health & Wellness</option>
                            <option value="yellow">💛 Yellow - Education</option>
                                <option value="indigo">💙 Indigo - Deep Tech</option>
                                <option value="teal">💚 Teal - Environment</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group" style="display: flex; gap: 2rem; align-items: center; margin-top: 1.5rem;">
                            <div class="checkbox-group">
                                <input type="checkbox" id="featured">
                                <label for="featured">Featured Project</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="published" checked>
                                <label for="published">Published</label>
                            </div>
                        </div>
                    </div>
                
                <button type="submit" id="projectSubmitBtn">✨ Add Project</button>
                <button type="button" onclick="clearProjectForm()" class="secondary">🔄 Clear</button>
                <button type="button" onclick="loadProjects()" class="secondary">♻️ Refresh</button>
            </form>
        </div>
        
        <div id="projectsList" class="items-list">Loading projects...</div>
    </div>

    <script>
        const API_BASE = window.location.origin;
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadProjects();
        });

        // Load statistics
        async function loadStats() {
            try {
                const response = await fetch(API_BASE + '/api/stats');
                const data = await response.json();
                
                document.getElementById('totalProjects').textContent = data.stats.totalProjects;
                document.getElementById('totalExperiences').textContent = data.stats.totalExperiences;
                document.getElementById('totalSkills').textContent = data.stats.totalSkills;
                document.getElementById('featuredProjects').textContent = data.stats.featuredProjects;
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        // Projects management
        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectId = document.getElementById('projectId').value;
            const isUpdate = !!projectId;
            
            const techArray = document.getElementById('tech').value
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);
            
            const projectData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                category: document.getElementById('category').value,
                techStack: techArray,
                impact: document.getElementById('impact').value,
                githubUrl: document.getElementById('github').value,
                demoUrl: document.getElementById('demo').value,
                color: document.getElementById('projectColor').value,
                featured: document.getElementById('featured').checked,
                published: document.getElementById('published').checked
            };
            
            try {
                const url = isUpdate 
                    ? API_BASE + '/api/update-project/' + projectId
                    : API_BASE + '/api/add-project';
                const method = isUpdate ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message + ' 🎉', 'success');
                    clearProjectForm();
                    loadProjects();
                    loadStats();
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        });

        function clearProjectForm() {
            document.getElementById('projectForm').reset();
            document.getElementById('projectId').value = '';
            document.getElementById('published').checked = true;
            document.getElementById('projectColor').value = 'blue'; // Reset to default blue
            document.getElementById('projectSubmitBtn').textContent = '✨ Add Project';
        }

        function editProject(project) {
            document.getElementById('projectId').value = project.id;
            document.getElementById('title').value = project.title;
            document.getElementById('description').value = project.description;
            document.getElementById('category').value = project.category;
            document.getElementById('tech').value = project.techStack.join(', ');
            document.getElementById('impact').value = project.impact || '';
            document.getElementById('github').value = project.githubUrl || '';
            document.getElementById('demo').value = project.demoUrl || '';
            document.getElementById('projectColor').value = project.color || 'blue';
            document.getElementById('featured').checked = project.featured;
            document.getElementById('published').checked = project.published;
            document.getElementById('projectSubmitBtn').textContent = '💾 Update Project';
            
            // Scroll to form
            document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
        }

        async function loadProjects() {
            try {
                const response = await fetch(API_BASE + '/api/projects');
                const data = await response.json();
                const projectsList = document.getElementById('projectsList');
                
                if (!data.projects || data.projects.length === 0) {
                    projectsList.innerHTML = '<p class="loading">No projects yet. Add your first project above!</p>';
                    return;
                }
                
                projectsList.innerHTML = data.projects.map(project => \`
                    <div class="item-card">
                        <div class="item-title">\${project.title}</div>
                        <p style="color: #94a3b8; margin-bottom: 1rem;">\${project.description}</p>
                        <div class="item-meta">
                            <span class="item-tag">\${project.category}</span>
                            \${project.featured ? '<span class="item-tag" style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; border-color: rgba(251, 191, 36, 0.3);">⭐ Featured</span>' : ''}
                            \${project.published ? '<span class="item-tag" style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.3);">✅ Published</span>' : '<span class="item-tag" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.3);">❌ Draft</span>'}
                        </div>
                        <div class="item-meta">
                            \${project.techStack.map(tech => \`<span class="item-tag">\${tech}</span>\`).join('')}
                        </div>
                        <div class="item-actions">
                            <button onclick="editProject(\${JSON.stringify(project).replace(/"/g, '&quot;')})" class="secondary">✏️ Edit</button>
                            <button onclick="deleteProject('\${project.id}')" class="danger">🗑️ Delete</button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('projectsList').innerHTML = 
                    '<p style="color: #f87171;">Error loading projects: ' + error.message + '</p>';
            }
        }

        async function deleteProject(id) {
            if (!confirm('Delete this project? This cannot be undone.')) return;
            
            try {
                const response = await fetch(API_BASE + '/api/delete-project/' + id, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Project deleted! 🗑️', 'success');
                    loadProjects();
                    loadStats();
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        }

        // Show messages
        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = \`<div class="message \${type}">\${text}</div>\`;
            setTimeout(() => messageDiv.innerHTML = '', 5000);
        }
    </script>
</body>
</html>
  `;
  
  res.send(adminHTML);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Enhanced Portfolio Backend - Auto-Port`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🏠 Welcome: http://localhost:${PORT}/`);
  console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n✨ Features:`);
  console.log(`   ✅ Auto-Port Selection (No Conflicts!)`);
  console.log(`   ✅ Projects Management (CRUD)`);
  console.log(`   ✅ Full Update Support`);
  console.log(`   ✅ Beautiful Admin Interface`);
  console.log(`   ✅ Root Welcome Page`);
  console.log(`\n🌟 No more port conflicts! Ready to manage your portfolio!\n`);
});
