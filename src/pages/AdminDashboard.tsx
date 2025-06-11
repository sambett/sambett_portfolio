import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  BarChart3, 
  ExternalLink,
  LogOut,
  X,
  Save
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { adminApi } from '../utils/api'
import type { Project } from '../types'

export const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0,
    totalExperiences: 0
  })

  const categories = ['All', 'AI', 'Optimization', 'DevOps', 'Global Impact', 'Web Development', 'Sustainability', 'Social']

  useEffect(() => {
    fetchProjects()
    fetchStats()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getProjects()
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await adminApi.getStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filterProjects = () => {
    let filtered = [...projects]

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        (project.techStack && project.techStack.some(tech => tech.toLowerCase().includes(term)))
      )
    }

    setFilteredProjects(filtered)
  }

  const deleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await adminApi.deleteProject(id)
        setProjects(projects.filter(p => p.id !== id))
        alert('Project deleted successfully!')
        await fetchStats() // Refresh stats
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const handleLogout = () => {
    logout()
  }

  const StatCard = ({ icon: Icon, label, value, color = "blue" }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  )

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {project.category}
          </span>
        </div>
        <div className="flex space-x-2">
          {project.githubUrl && (
            <button
              onClick={() => window.open(project.githubUrl, '_blank')}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Eye size={18} />
            </button>
          )}
          <button
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Project"
            onClick={() => setEditingProject(project)}
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteProject(project.id)}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
        {project.description.length > 100 
          ? `${project.description.substring(0, 100)}...` 
          : project.description
        }
      </p>

      {project.techStack && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'No date'}</span>
        <div className="flex space-x-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ExternalLink size={14} className="mr-1" />
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-600 hover:text-green-700"
            >
              <ExternalLink size={14} className="mr-1" />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )

  const ProjectModal = ({ project, onClose, onSave }: { 
    project?: Project | null, 
    onClose: () => void, 
    onSave: (project: any) => void 
  }) => {
    const [formData, setFormData] = useState({
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || 'AI',
      techStack: project?.techStack?.join(', ') || '',
      githubUrl: project?.githubUrl || '',
      demoUrl: project?.demoUrl || '',
      featured: project?.featured || false
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
      }
      onSave(projectData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {project ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.filter(c => c !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="React, TypeScript, Node.js"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured Project</label>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{project ? 'Update' : 'Create'} Project</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        await adminApi.updateProject(editingProject.id, projectData)
        alert('Project updated successfully!')
      } else {
        await adminApi.createProject(projectData)
        alert('Project created successfully!')
      }
      
      await fetchProjects()
      await fetchStats()
      setShowCreateModal(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <span className="text-sm text-slate-500">Welcome back, {user?.username}</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-600 transition-colors"
                title="View Portfolio"
              >
                <ExternalLink size={20} />
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={BarChart3}
              label="Total Projects"
              value={stats.totalProjects}
              color="blue"
            />
            <StatCard
              icon={Eye}
              label="Published"
              value={stats.publishedProjects}
              color="green"
            />
            <StatCard
              icon={BarChart3}
              label="Featured"
              value={stats.featuredProjects}
              color="purple"
            />
            <StatCard
              icon={BarChart3}
              label="Experiences"
              value={stats.totalExperiences}
              color="orange"
            />
          </div>

          {/* Projects Management */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl font-bold text-slate-900">Manage Projects</h2>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={20} className="mr-2" />
                  Add New Project
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-slate-600">Loading projects...</p>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
                  <p className="text-slate-600 mb-4">
                    {searchTerm || selectedCategory !== 'All' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by adding your first project'
                    }
                  </p>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <ProjectModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleSaveProject}
          />
        )}
        {editingProject && (
          <ProjectModal
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSave={handleSaveProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}