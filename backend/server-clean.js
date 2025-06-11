import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
// PUBLIC API ROUTES (Keep frontend working exactly as before)
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: '🚀 Clean Portfolio Backend'
  });
});

// Get all projects (frontend expects this exact format)
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

// Get experiences (frontend expects this)
app.get('/api/experiences', async (req, res) => {
  try {
    const data = await readJSON(EXPERIENCES_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form (keep this working)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, projectType } = req.body;
    console.log('📧 Contact form:', { name, email, message, projectType });
    
    // In a real app, you'd send email here
    // For now, just log and respond
    res.json({ 
      success: true, 
      message: 'Thank you! I\'ll get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============================================================================
// SIMPLE CONTENT MANAGEMENT (No authentication - local use only)
// ============================================================================

// 📝 Add new project (simple endpoint)
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
      published: req.body.published !== false, // default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: req.body.images || []
    };
    
    data.projects.unshift(newProject); // Add to beginning
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

// 🔄 Update project
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

// 🗑️ Delete project  
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

// 📊 Simple stats
app.get('/api/stats', async (req, res) => {
  try {
    const projectsData = await readJSON(PROJECTS_FILE);
    const experiencesData = await readJSON(EXPERIENCES_FILE);
    
    const stats = {
      totalProjects: projectsData.projects.length,
      publishedProjects: projectsData.projects.filter(p => p.published !== false).length,
      featuredProjects: projectsData.projects.filter(p => p.featured).length,
      totalExperiences: experiencesData.experiences?.length || 0,
      categories: [...new Set(projectsData.projects.map(p => p.category))],
      technologies: [...new Set(projectsData.projects.flatMap(p => p.techStack))].sort()
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📋 Simple admin panel (basic HTML form)
app.get('/admin', (req, res) => {
  const adminHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Admin - Simple</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; padding: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        textarea { resize: vertical; min-height: 80px; }
        button { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 5px; }
        button:hover { background: #005a87; }
        .checkbox-group { display: flex; align-items: center; gap: 10px; }
        .checkbox-group input { width: auto; }
        .tech-input { background: #f8f9fa; border: 1px solid #e9ecef; }
        .message { padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .current-projects { margin-top: 30px; padding-top: 30px; border-top: 2px solid #eee; }
        .project-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007cba; }
        .project-meta { display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap; }
        .project-meta span { background: #e9ecef; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        .delete-btn { background: #dc3545; font-size: 12px; padding: 5px 10px; }
        .delete-btn:hover { background: #c82333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Portfolio Admin</h1>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">Simple content management for your portfolio</p>
        
        <div id="message"></div>
        
        <form id="projectForm">
            <div class="form-group">
                <label>Project Title *</label>
                <input type="text" id="title" required placeholder="e.g., AI Assistant App">
            </div>
            
            <div class="form-group">
                <label>Description *</label>
                <textarea id="description" required placeholder="Brief description of what this project does..."></textarea>
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
            
            <div class="form-group">
                <label>Technologies (comma-separated)</label>
                <input type="text" id="tech" class="tech-input" placeholder="React, Python, TensorFlow">
            </div>
            
            <div class="form-group">
                <label>Impact Statement</label>
                <textarea id="impact" placeholder="What problem does this solve? What's the result?"></textarea>
            </div>
            
            <div class="form-group">
                <label>GitHub URL</label>
                <input type="url" id="github" placeholder="https://github.com/username/repo">
            </div>
            
            <div class="form-group">
                <label>Demo URL</label>
                <input type="url" id="demo" placeholder="https://your-demo.com">
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="featured">
                <label for="featured">Featured Project</label>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="published" checked>
                <label for="published">Published</label>
            </div>
            
            <button type="submit">✨ Add Project</button>
            <button type="button" onclick="loadProjects()">🔄 Refresh</button>
        </form>
        
        <div class="current-projects">
            <h2>📁 Current Projects</h2>
            <div id="projectsList">Loading...</div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin;
        
        // Load projects on page load
        document.addEventListener('DOMContentLoaded', loadProjects);
        
        // Form submission
        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
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
                featured: document.getElementById('featured').checked,
                published: document.getElementById('published').checked
            };
            
            try {
                const response = await fetch(API_BASE + '/api/add-project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Project added successfully! 🎉', 'success');
                    document.getElementById('projectForm').reset();
                    document.getElementById('published').checked = true;
                    loadProjects();
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        });
        
        // Load and display projects
        async function loadProjects() {
            try {
                const response = await fetch(API_BASE + '/api/projects');
                const data = await response.json();
                const projectsList = document.getElementById('projectsList');
                
                if (!data.projects || data.projects.length === 0) {
                    projectsList.innerHTML = '<p>No projects yet. Add your first project above!</p>';
                    return;
                }
                
                projectsList.innerHTML = data.projects.map(project => \`
                    <div class="project-item">
                        <h3>\${project.title}</h3>
                        <p>\${project.description}</p>
                        <div class="project-meta">
                            <span>\${project.category}</span>
                            \${project.featured ? '<span style="background: #fff3cd; color: #856404;">⭐ Featured</span>' : ''}
                            \${project.published ? '<span style="background: #d1edff; color: #0c5460;">✅ Published</span>' : '<span style="background: #f8d7da; color: #721c24;">❌ Draft</span>'}
                        </div>
                        <div class="project-meta">
                            \${project.techStack.map(tech => \`<span>\${tech}</span>\`).join('')}
                        </div>
                        <button class="delete-btn" onclick="deleteProject('\${project.id}')">🗑️ Delete</button>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('projectsList').innerHTML = 
                    '<p style="color: #dc3545;">Error loading projects: ' + error.message + '</p>';
            }
        }
        
        // Delete project
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
  console.log(`\n🚀 Clean Portfolio Backend`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n✨ Ready to manage your portfolio content!\n`);
});
