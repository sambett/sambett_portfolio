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
import multer from 'multer';
import sharp from 'sharp';

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
const MEDIA_DIR = path.join(__dirname, '../public/media');
const CV_DIR = path.join(MEDIA_DIR, 'cv');
const CERTIFICATES_DIR = path.join(MEDIA_DIR, 'certificates');

const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');

// Create a documents.json file to track uploaded documents
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');

// Ensure all directories exist
const ensureDirectories = async () => {
  const dirs = [DATA_DIR, MEDIA_DIR, CV_DIR, CERTIFICATES_DIR];
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }
};

await ensureDirectories();

// Initialize documents.json if it doesn't exist
const initializeDocuments = async () => {
  try {
    await fs.access(DOCUMENTS_FILE);
  } catch {
    const initialData = {
      cv: {
        current: null,
        versions: []
      },
      certificates: []
    };
    await fs.writeFile(DOCUMENTS_FILE, JSON.stringify(initialData, null, 2));
    console.log('📄 Created documents.json');
  }
};

await initializeDocuments();

// =============================================================================
// FILE UPLOAD CONFIGURATION
// =============================================================================

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.params.type || req.body.uploadType;
    let uploadPath;
    
    switch (uploadType) {
      case 'cv':
        uploadPath = CV_DIR;
        break;
      case 'certificate':
        uploadPath = CERTIFICATES_DIR;
        break;
      default:
        uploadPath = MEDIA_DIR;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    cb(null, filename);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const uploadType = req.params.type || req.body.uploadType;
  
  if (uploadType === 'cv') {
    // Allow PDF files for CV
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('CV must be a PDF file'), false);
    }
  } else if (uploadType === 'certificate') {
    // Allow PDF and images for certificates
    if (file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Certificates must be PDF or image files'), false);
    }
  } else {
    // General file uploads
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

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
// STATIC FILE SERVING
// =============================================================================

// Serve uploaded files
app.use('/media', express.static(MEDIA_DIR));

// =============================================================================
// ROOT HEALTH DASHBOARD
// =============================================================================

// Beautiful Backend Health Dashboard
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
        
        <p>Backend server for <strong>Selma Bettaieb's AI Portfolio</strong> - managing projects, global experiences, CV uploads, and certificates with a clean, modular approach.</p>
        
        <div class="links">
            <a href="/admin" class="link">🔧 Admin Panel</a>
            <a href="/api/health" class="link">📊 API Health</a>
            <a href="/api/projects" class="link">📁 Projects API</a>
            <a href="/api/documents" class="link">📄 Documents API</a>
        </div>
        
        <div class="api-list">
            <h3>🔗 Available Endpoints</h3>
            <code>GET  /api/projects - Get all projects</code>
            <code>GET  /api/experiences - Get global experiences</code>
            <code>GET  /api/documents - Get CV and certificates</code>
            <code>GET  /api/cv/download - Download current CV</code>
            <code>POST /api/contact - Contact form submission</code>
            <code>POST /admin/login - Admin authentication</code>
            <code>GET  /admin - Enhanced admin dashboard</code>
        </div>
        
        <div class="footer">
            <p>✨ Built with Express.js • File Uploads • Authentication • Scalable</p>
            <p>Port: ${PORT} • Time: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(welcomeHTML);
});

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
    uploads: 'enabled',
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

// Get documents info (CV and certificates)
app.get('/api/documents', async (req, res) => {
  try {
    const data = await readJSONFile(DOCUMENTS_FILE);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download current CV
app.get('/api/cv/download', async (req, res) => {
  try {
    const documents = await readJSONFile(DOCUMENTS_FILE);
    
    if (!documents.cv.current) {
      return res.status(404).json({ error: 'No CV available' });
    }
    
    const cvPath = path.join(CV_DIR, documents.cv.current.filename);
    
    // Check if file exists
    try {
      await fs.access(cvPath);
    } catch {
      return res.status(404).json({ error: 'CV file not found' });
    }
    
    res.download(cvPath, documents.cv.current.originalName || 'CV.pdf');
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
// ADMIN PROTECTED ROUTES - PROJECTS
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

// =============================================================================
// ADMIN PROTECTED ROUTES - FILE UPLOADS
// =============================================================================

// Upload CV
app.post('/api/admin/upload/cv', authenticateToken, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file provided' });
    }
    
    const documents = await readJSONFile(DOCUMENTS_FILE);
    
    // Archive current CV if exists
    if (documents.cv.current) {
      documents.cv.versions.push({
        ...documents.cv.current,
        archivedAt: new Date().toISOString()
      });
    }
    
    // Set new current CV
    documents.cv.current = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      description: req.body.description || 'Current CV'
    };
    
    await writeJSONFile(DOCUMENTS_FILE, documents);
    
    console.log(`✅ CV uploaded: ${req.file.filename}`);
    res.json({
      success: true,
      message: 'CV uploaded successfully',
      file: documents.cv.current
    });
  } catch (error) {
    console.error('❌ CV upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload certificate
app.post('/api/admin/upload/certificate', authenticateToken, upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No certificate file provided' });
    }
    
    const documents = await readJSONFile(DOCUMENTS_FILE);
    
    const newCertificate = {
      id: `cert-${Date.now()}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      issuer: req.body.issuer || '',
      dateIssued: req.body.dateIssued || '',
      uploadedAt: new Date().toISOString()
    };
    
    documents.certificates.push(newCertificate);
    await writeJSONFile(DOCUMENTS_FILE, documents);
    
    console.log(`✅ Certificate uploaded: ${req.file.filename}`);
    res.json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate: newCertificate
    });
  } catch (error) {
    console.error('❌ Certificate upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents for admin
app.get('/api/admin/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await readJSONFile(DOCUMENTS_FILE);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete CV version
app.delete('/api/admin/cv/:version', authenticateToken, async (req, res) => {
  try {
    const documents = await readJSONFile(DOCUMENTS_FILE);
    const version = req.params.version;
    
    let deletedFile = null;
    
    if (version === 'current' && documents.cv.current) {
      deletedFile = documents.cv.current;
      documents.cv.current = null;
    } else {
      const versionIndex = documents.cv.versions.findIndex(v => v.filename === version);
      if (versionIndex !== -1) {
        deletedFile = documents.cv.versions[versionIndex];
        documents.cv.versions.splice(versionIndex, 1);
      }
    }
    
    if (!deletedFile) {
      return res.status(404).json({ error: 'CV version not found' });
    }
    
    // Delete the actual file
    const filePath = path.join(CV_DIR, deletedFile.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log(`⚠️ Could not delete file: ${filePath}`);
    }
    
    await writeJSONFile(DOCUMENTS_FILE, documents);
    
    res.json({
      success: true,
      message: 'CV deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete certificate
app.delete('/api/admin/certificates/:id', authenticateToken, async (req, res) => {
  try {
    const documents = await readJSONFile(DOCUMENTS_FILE);
    const certificateIndex = documents.certificates.findIndex(c => c.id === req.params.id);
    
    if (certificateIndex === -1) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    const certificate = documents.certificates[certificateIndex];
    
    // Delete the actual file
    const filePath = path.join(CERTIFICATES_DIR, certificate.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log(`⚠️ Could not delete file: ${filePath}`);
    }
    
    documents.certificates.splice(certificateIndex, 1);
    await writeJSONFile(DOCUMENTS_FILE, documents);
    
    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update certificate details
app.put('/api/admin/certificates/:id', authenticateToken, async (req, res) => {
  try {
    const documents = await readJSONFile(DOCUMENTS_FILE);
    const certificateIndex = documents.certificates.findIndex(c => c.id === req.params.id);
    
    if (certificateIndex === -1) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    documents.certificates[certificateIndex] = {
      ...documents.certificates[certificateIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSONFile(DOCUMENTS_FILE, documents);
    
    res.json({
      success: true,
      message: 'Certificate updated successfully',
      certificate: documents.certificates[certificateIndex]
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
    const documentsData = await readJSONFile(DOCUMENTS_FILE);
    
    const stats = {
      totalProjects: projectsData.projects.length,
      publishedProjects: projectsData.projects.filter(p => p.published !== false).length,
      featuredProjects: projectsData.projects.filter(p => p.featured).length,
      totalExperiences: experiencesData.experiences ? experiencesData.experiences.length : 0,
      currentCV: documentsData.cv.current ? true : false,
      totalCertificates: documentsData.certificates.length,
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
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Serve enhanced admin dashboard with file upload capabilities
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
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
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
        button.success { background: #10b981; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #f8fafc; padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #e2e8f0; }
        .stat-number { font-size: 2em; font-weight: bold; color: #4f46e5; }
        .stat-label { color: #64748b; font-weight: 500; font-size: 0.9em; }
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
        .tabs { display: flex; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; }
        .tab { padding: 15px 25px; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; transition: all 0.3s; }
        .tab.active { border-bottom-color: #4f46e5; color: #4f46e5; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .file-upload-area { border: 3px dashed #d1d5db; border-radius: 15px; padding: 40px; text-align: center; transition: border-color 0.3s; margin-bottom: 20px; }
        .file-upload-area.dragover { border-color: #4f46e5; background: #f0f7ff; }
        .file-info { background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 10px 0; }
        .document-item { background: #f9fafb; padding: 20px; margin: 15px 0; border-radius: 15px; border-left: 5px solid #10b981; }
        .progress-bar { width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: #4f46e5; transition: width 0.3s; }
        @media (max-width: 768px) { 
            .form-row { grid-template-columns: 1fr; } 
            .header h1 { font-size: 2em; } 
            .tabs { flex-wrap: wrap; }
            .tab { flex: 1; min-width: 120px; }
        }
        .loading { text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Portfolio Admin</h1>
            <p>Manage your projects, CV, and certificates</p>
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
                    <div class="stat-card">
                        <div class="stat-number" id="currentCV">-</div>
                        <div class="stat-label">CV Status</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="totalCertificates">-</div>
                        <div class="stat-label">Certificates</div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <div class="tab active" onclick="showTab('projects')">📁 Projects</div>
                    <div class="tab" onclick="showTab('cv')">📄 CV Management</div>
                    <div class="tab" onclick="showTab('certificates')">🏆 Certificates</div>
                </div>
                
                <!-- Projects Tab -->
                <div id="projectsTab" class="tab-content active">
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
                    </form>
                    
                    <!-- Projects List -->
                    <div class="projects-list">
                        <h2>📁 Current Projects</h2>
                        <div id="projectsList" class="loading">Loading projects...</div>
                    </div>
                </div>
                
                <!-- CV Tab -->
                <div id="cvTab" class="tab-content">
                    <h2>📄 CV Management</h2>
                    
                    <!-- Upload CV -->
                    <div class="file-upload-area" id="cvUploadArea">
                        <p style="font-size: 1.2em; margin-bottom: 15px;">📤 Upload New CV</p>
                        <p style="color: #6b7280; margin-bottom: 20px;">Drag & drop your CV here or click to select</p>
                        <input type="file" id="cvFileInput" accept=".pdf" style="display: none;">
                        <button type="button" onclick="document.getElementById('cvFileInput').click()" class="secondary">Select CV File</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Description (Optional):</label>
                        <input type="text" id="cvDescription" placeholder="e.g., Updated CV - January 2024">
                    </div>
                    
                    <button onclick="uploadCV()" class="success" disabled id="uploadCVBtn">📄 Upload CV</button>
                    
                    <div id="cvProgress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="cvProgressFill" style="width: 0%;"></div>
                        </div>
                        <p style="text-align: center; color: #6b7280;">Uploading...</p>
                    </div>
                    
                    <!-- Current CV -->
                    <div id="currentCV" class="loading">Loading CV info...</div>
                </div>
                
                <!-- Certificates Tab -->
                <div id="certificatesTab" class="tab-content">
                    <h2>🏆 Certificate Management</h2>
                    
                    <!-- Upload Certificate -->
                    <div class="file-upload-area" id="certUploadArea">
                        <p style="font-size: 1.2em; margin-bottom: 15px;">📤 Upload New Certificate</p>
                        <p style="color: #6b7280; margin-bottom: 20px;">Drag & drop your certificate here or click to select</p>
                        <input type="file" id="certFileInput" accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                        <button type="button" onclick="document.getElementById('certFileInput').click()" class="secondary">Select Certificate</button>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Certificate Title:</label>
                            <input type="text" id="certTitle" placeholder="e.g., AWS Certified Solutions Architect">
                        </div>
                        <div class="form-group">
                            <label>Issuer:</label>
                            <input type="text" id="certIssuer" placeholder="e.g., Amazon Web Services">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date Issued:</label>
                            <input type="date" id="certDate">
                        </div>
                        <div class="form-group">
                            <label>Description (Optional):</label>
                            <input type="text" id="certDescription" placeholder="Brief description or achievement">
                        </div>
                    </div>
                    
                    <button onclick="uploadCertificate()" class="success" disabled id="uploadCertBtn">🏆 Upload Certificate</button>
                    
                    <div id="certProgress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="certProgressFill" style="width: 0%;"></div>
                        </div>
                        <p style="text-align: center; color: #6b7280;">Uploading...</p>
                    </div>
                    
                    <!-- Certificates List -->
                    <div id="certificatesList" class="loading">Loading certificates...</div>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <button type="button" onclick="logout()" class="danger">🚪 Logout</button>
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
            setupFileHandlers();
        });
        
        // Tab switching
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName + 'Tab').classList.add('active');
            event.target.classList.add('active');
            
            // Load data for specific tabs
            if (tabName === 'cv') {
                loadCVInfo();
            } else if (tabName === 'certificates') {
                loadCertificates();
            }
        }
        
        // File upload handlers
        function setupFileHandlers() {
            // CV file input
            const cvFileInput = document.getElementById('cvFileInput');
            const cvUploadArea = document.getElementById('cvUploadArea');
            const uploadCVBtn = document.getElementById('uploadCVBtn');
            
            cvFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    uploadCVBtn.disabled = false;
                    showMessage('CV file selected: ' + e.target.files[0].name, 'success');
                }
            });
            
            // CV drag and drop
            cvUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                cvUploadArea.classList.add('dragover');
            });
            
            cvUploadArea.addEventListener('dragleave', () => {
                cvUploadArea.classList.remove('dragover');
            });
            
            cvUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                cvUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type === 'application/pdf') {
                    cvFileInput.files = files;
                    uploadCVBtn.disabled = false;
                    showMessage('CV file dropped: ' + files[0].name, 'success');
                } else {
                    showMessage('Please drop a PDF file', 'error');
                }
            });
            
            // Certificate file input
            const certFileInput = document.getElementById('certFileInput');
            const certUploadArea = document.getElementById('certUploadArea');
            const uploadCertBtn = document.getElementById('uploadCertBtn');
            
            certFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    uploadCertBtn.disabled = false;
                    showMessage('Certificate file selected: ' + e.target.files[0].name, 'success');
                }
            });
            
            // Certificate drag and drop
            certUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                certUploadArea.classList.add('dragover');
            });
            
            certUploadArea.addEventListener('dragleave', () => {
                certUploadArea.classList.remove('dragover');
            });
            
            certUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                certUploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                        certFileInput.files = files;
                        uploadCertBtn.disabled = false;
                        showMessage('Certificate file dropped: ' + file.name, 'success');
                    } else {
                        showMessage('Please drop a PDF or image file', 'error');
                    }
                }
            });
        }
        
        // Upload CV
        async function uploadCV() {
            const fileInput = document.getElementById('cvFileInput');
            const description = document.getElementById('cvDescription').value;
            
            if (!fileInput.files.length) {
                showMessage('Please select a CV file', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('cv', fileInput.files[0]);
            formData.append('description', description);
            
            const progressDiv = document.getElementById('cvProgress');
            const progressFill = document.getElementById('cvProgressFill');
            
            try {
                progressDiv.style.display = 'block';
                progressFill.style.width = '50%';
                
                const response = await fetch(API_BASE + '/api/admin/upload/cv', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: formData
                });
                
                progressFill.style.width = '100%';
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('CV uploaded successfully! 📄', 'success');
                    fileInput.value = '';
                    document.getElementById('cvDescription').value = '';
                    document.getElementById('uploadCVBtn').disabled = true;
                    loadStats();
                    loadCVInfo();
                } else {
                    showMessage('Error uploading CV: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            } finally {
                progressDiv.style.display = 'none';
                progressFill.style.width = '0%';
            }
        }
        
        // Upload Certificate
        async function uploadCertificate() {
            const fileInput = document.getElementById('certFileInput');
            const title = document.getElementById('certTitle').value;
            const issuer = document.getElementById('certIssuer').value;
            const dateIssued = document.getElementById('certDate').value;
            const description = document.getElementById('certDescription').value;
            
            if (!fileInput.files.length) {
                showMessage('Please select a certificate file', 'error');
                return;
            }
            
            if (!title) {
                showMessage('Please enter a certificate title', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('certificate', fileInput.files[0]);
            formData.append('title', title);
            formData.append('issuer', issuer);
            formData.append('dateIssued', dateIssued);
            formData.append('description', description);
            
            const progressDiv = document.getElementById('certProgress');
            const progressFill = document.getElementById('certProgressFill');
            
            try {
                progressDiv.style.display = 'block';
                progressFill.style.width = '50%';
                
                const response = await fetch(API_BASE + '/api/admin/upload/certificate', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: formData
                });
                
                progressFill.style.width = '100%';
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Certificate uploaded successfully! 🏆', 'success');
                    // Clear form
                    fileInput.value = '';
                    document.getElementById('certTitle').value = '';
                    document.getElementById('certIssuer').value = '';
                    document.getElementById('certDate').value = '';
                    document.getElementById('certDescription').value = '';
                    document.getElementById('uploadCertBtn').disabled = true;
                    loadStats();
                    loadCertificates();
                } else {
                    showMessage('Error uploading certificate: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            } finally {
                progressDiv.style.display = 'none';
                progressFill.style.width = '0%';
            }
        }
        
        // Load CV info
        async function loadCVInfo() {
            try {
                const response = await fetch(API_BASE + '/api/admin/documents', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load CV info');
                }
                
                const data = await response.json();
                const currentCVDiv = document.getElementById('currentCV');
                
                if (data.cv.current) {
                    const cv = data.cv.current;
                    currentCVDiv.innerHTML = \`
                        <div class="document-item">
                            <h3>📄 Current CV</h3>
                            <div class="file-info">
                                <p><strong>File:</strong> \${cv.originalName}</p>
                                <p><strong>Size:</strong> \${(cv.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p><strong>Uploaded:</strong> \${new Date(cv.uploadedAt).toLocaleDateString()}</p>
                                \${cv.description ? \`<p><strong>Description:</strong> \${cv.description}</p>\` : ''}
                            </div>
                            <div style="margin-top: 15px;">
                                <a href="/media/cv/\${cv.filename}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">👁️ View</a>
                                <a href="/media/cv/\${cv.filename}" download="\${cv.originalName}" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">⬇️ Download</a>
                                <button onclick="deleteCV('current')" class="danger" style="padding: 6px 12px; font-size: 14px;">🗑️ Delete</button>
                            </div>
                        </div>
                    \`;
                } else {
                    currentCVDiv.innerHTML = '<p style="text-align: center; color: #6b7280;">No CV uploaded yet. Upload your first CV above! 📄</p>';
                }
                
                // Show previous versions if any
                if (data.cv.versions.length > 0) {
                    const versionsHTML = data.cv.versions.map(version => \`
                        <div class="document-item" style="border-left-color: #6b7280;">
                            <h4>📄 Previous Version</h4>
                            <div class="file-info">
                                <p><strong>File:</strong> \${version.originalName}</p>
                                <p><strong>Archived:</strong> \${new Date(version.archivedAt).toLocaleDateString()}</p>
                            </div>
                            <div style="margin-top: 15px;">
                                <a href="/media/cv/\${version.filename}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">👁️ View</a>
                                <button onclick="deleteCV('\${version.filename}')" class="danger" style="padding: 6px 12px; font-size: 14px;">🗑️ Delete</button>
                            </div>
                        </div>
                    \`).join('');
                    
                    currentCVDiv.innerHTML += \`
                        <h3 style="margin-top: 30px; margin-bottom: 15px;">📚 Previous Versions</h3>
                        \${versionsHTML}
                    \`;
                }
            } catch (error) {
                document.getElementById('currentCV').innerHTML = 
                    '<p style="color: #dc2626; text-align: center;">Error loading CV info: ' + error.message + '</p>';
            }
        }
        
        // Load certificates
        async function loadCertificates() {
            try {
                const response = await fetch(API_BASE + '/api/admin/documents', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load certificates');
                }
                
                const data = await response.json();
                const certificatesDiv = document.getElementById('certificatesList');
                
                if (data.certificates.length === 0) {
                    certificatesDiv.innerHTML = '<p style="text-align: center; color: #6b7280;">No certificates uploaded yet. Upload your first certificate above! 🏆</p>';
                    return;
                }
                
                const certificatesHTML = data.certificates.map(cert => \`
                    <div class="document-item">
                        <h3>🏆 \${cert.title}</h3>
                        <div class="file-info">
                            <p><strong>File:</strong> \${cert.originalName}</p>
                            \${cert.issuer ? \`<p><strong>Issuer:</strong> \${cert.issuer}</p>\` : ''}
                            \${cert.dateIssued ? \`<p><strong>Date Issued:</strong> \${new Date(cert.dateIssued).toLocaleDateString()}</p>\` : ''}
                            \${cert.description ? \`<p><strong>Description:</strong> \${cert.description}</p>\` : ''}
                            <p><strong>Uploaded:</strong> \${new Date(cert.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <div style="margin-top: 15px;">
                            <a href="/media/certificates/\${cert.filename}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">👁️ View</a>
                            <a href="/media/certificates/\${cert.filename}" download="\${cert.originalName}" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">⬇️ Download</a>
                            <button onclick="deleteCertificate('\${cert.id}')" class="danger" style="padding: 6px 12px; font-size: 14px;">🗑️ Delete</button>
                        </div>
                    </div>
                \`).join('');
                
                certificatesDiv.innerHTML = \`
                    <h2>🏆 Your Certificates</h2>
                    \${certificatesHTML}
                \`;
            } catch (error) {
                document.getElementById('certificatesList').innerHTML = 
                    '<p style="color: #dc2626; text-align: center;">Error loading certificates: ' + error.message + '</p>';
            }
        }
        
        // Delete CV
        async function deleteCV(version) {
            if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/admin/cv/' + version, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('CV deleted successfully! 🗑️', 'success');
                    loadStats();
                    loadCVInfo();
                } else {
                    showMessage('Error deleting CV: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        }
        
        // Delete certificate
        async function deleteCertificate(id) {
            if (!confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/admin/certificates/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Certificate deleted successfully! 🗑️', 'success');
                    loadStats();
                    loadCertificates();
                } else {
                    showMessage('Error deleting certificate: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Network error: ' + error.message, 'error');
            }
        }
        
        // Existing functions (login, projects, etc.) remain the same...
        
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
        
        // Load stats (updated to include CV and certificates)
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
                    document.getElementById('currentCV').textContent = data.stats.currentCV ? '✅' : '❌';
                    document.getElementById('totalCertificates').textContent = data.stats.totalCertificates;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        
        // Form submission (existing project form)
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
                        ? project.tech.map(t => \`<span>\${t}</span>\`).join('')
                        : (project.tech ? \`<span>\${project.tech}</span>\` : '');
                    
                    projectDiv.innerHTML = \`
                        <div class="project-title">\${project.title}</div>
                        <p style="color: #4b5563; margin-bottom: 10px;">\${project.description}</p>
                        <div class="project-meta">
                            <span style="background: #ddd6fe; color: #7c3aed;">\${project.category}</span>
                            <span style="background: #ecfdf5; color: #059669;">\${project.status}</span>
                            \${project.featured ? '<span style="background: #fef3c7; color: #d97706;">⭐ Featured</span>' : ''}
                            \${project.published ? '<span style="background: #dcfce7; color: #16a34a;">✅ Published</span>' : '<span style="background: #fef2f2; color: #dc2626;">❌ Draft</span>'}
                        </div>
                        <div class="project-meta">\${techTags}</div>
                        <div style="margin-top: 15px;">
                            \${project.github ? \`<a href="\${project.github}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">📱 GitHub</a>\` : ''}
                            \${project.demo ? \`<a href="\${project.demo}" target="_blank" style="color: #4f46e5; text-decoration: none; margin-right: 15px;">🌐 Demo</a>\` : ''}
                            <button onclick="deleteProject('\${project.id}')" class="danger" style="padding: 6px 12px; font-size: 14px;">🗑️ Delete</button>
                        </div>
                    \`;
                    
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
            messageDiv.innerHTML = \`<div class="message \${type}">\${text}</div>\`;
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
  console.log(`🔐 Admin Panel: http://localhost:5173/admin`);
  console.log(`📊 Enhanced Dashboard with File Uploads`);
  console.log(`\n🔑 Demo Credentials:`);
  console.log(`   Username: admin`);
  console.log(`   Password: selma2024`);
  console.log(`\n✨ Features Enabled:`);
  console.log(`   📁 Project Management`);
  console.log(`   📄 CV Upload & Management`);
  console.log(`   🏆 Certificate Upload & Management`);
  console.log(`   📤 Drag & Drop File Upload`);
  console.log(`   🔄 Version Control for CV`);
  console.log(`\n🌟 Backend ready on port ${PORT}! Frontend should connect automatically.`);
  console.log(`📝 Your Portfolio: http://localhost:5173/\n`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});
