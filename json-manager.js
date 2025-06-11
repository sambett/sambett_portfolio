import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_DIR = path.join(__dirname, 'public/data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Template for new project
const PROJECT_TEMPLATE = {
  id: "", // Will be auto-generated
  title: "",
  description: "",
  category: "AI", // AI, Optimization, Social, Sustainability, Other
  techStack: [], // Array of strings
  githubUrl: "",
  demoUrl: "",
  impact: "",
  featured: false,
  published: true,
  images: []
};

// Utility functions
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
};

const writeJSON = async (filePath, data) => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Successfully updated ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    return false;
  }
};

// Add a new project
const addProject = async (projectData) => {
  const data = await readJSON(PROJECTS_FILE);
  if (!data) return false;
  
  const newProject = {
    ...PROJECT_TEMPLATE,
    ...projectData,
    id: projectData.id || `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.projects.unshift(newProject); // Add to beginning
  return await writeJSON(PROJECTS_FILE, data);
};

// List all projects
const listProjects = async () => {
  const data = await readJSON(PROJECTS_FILE);
  if (!data) return;
  
  console.log('\n📁 Current Projects:');
  console.log('='.repeat(50));
  
  data.projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title}`);
    console.log(`   Category: ${project.category}`);
    console.log(`   Tech: ${project.techStack.join(', ')}`);
    console.log(`   Featured: ${project.featured ? '⭐ Yes' : 'No'}`);
    console.log(`   Published: ${project.published ? '✅ Yes' : '❌ No'}`);
    console.log('');
  });
};

// Main CLI interface
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🚀 Portfolio JSON Manager\n');
  
  switch (command) {
    case 'list':
      await listProjects();
      break;
      
    case 'add':
      console.log('📝 Adding new project...');
      console.log('ℹ️  Fill in the data below, then run: node json-manager.js commit\n');
      
      // Create a template file for editing
      const template = {
        ...PROJECT_TEMPLATE,
        title: "Your Project Title",
        description: "Brief description of what this project does...",
        category: "AI", // Change to: AI, Optimization, Social, Sustainability, Other
        techStack: ["React", "Python", "TensorFlow"], // Add your technologies
        impact: "What problem does this solve? What's the result?",
        githubUrl: "https://github.com/username/repo",
        demoUrl: "https://your-demo.com",
        featured: false, // Set to true for featured projects
        published: true  // Set to false for drafts
      };
      
      await fs.writeFile('new-project.json', JSON.stringify(template, null, 2));
      console.log('✅ Created new-project.json - edit this file and run:');
      console.log('   node json-manager.js commit');
      break;
      
    case 'commit':
      console.log('💾 Committing new project...');
      try {
        const newProjectData = await fs.readFile('new-project.json', 'utf8');
        const projectData = JSON.parse(newProjectData);
        
        const success = await addProject(projectData);
        if (success) {
          console.log('🎉 Project added successfully!');
          await fs.unlink('new-project.json'); // Clean up
        }
      } catch (error) {
        console.error('❌ Error committing project:', error.message);
        console.log('Make sure new-project.json exists and is valid JSON');
      }
      break;
      
    case 'backup':
      console.log('💾 Creating backup...');
      const data = await readJSON(PROJECTS_FILE);
      if (data) {
        const backupFile = `projects-backup-${Date.now()}.json`;
        await writeJSON(backupFile, data);
        console.log(`✅ Backup created: ${backupFile}`);
      }
      break;
      
    default:
      console.log('Usage:');
      console.log('  node json-manager.js list     - List all projects');
      console.log('  node json-manager.js add      - Create template for new project');
      console.log('  node json-manager.js commit   - Add the project from new-project.json');
      console.log('  node json-manager.js backup   - Create backup of projects');
      console.log('');
      console.log('Quick workflow:');
      console.log('  1. node json-manager.js add');
      console.log('  2. Edit new-project.json');
      console.log('  3. node json-manager.js commit');
  }
};

main().catch(console.error);
