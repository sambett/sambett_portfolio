import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  ExternalLink,
  Calendar,
  Tag,
  Github
} from 'lucide-react'
import { api } from '../../utils/api'
import type { Project } from '../../types'

export const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = ['All', 'AI', 'Optimization', 'DevOps', 'Global Impact', 'Web Development']

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/api/projects')
      setProjects(response.data)
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
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
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      )
    }

    setFilteredProjects(filtered)
  }

  const deleteProject = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/api/projects/${id}`)
        setProjects(projects.filter(p => p._id !== id))
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
              <Tag size={12} className="mr-1" />
              {project.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center">
              <Calendar size={12} className="mr-1" />
              {new Date(project.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {project.liveUrl && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(project.liveUrl, '_blank')}
              className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="View Live Project"
            >
              <Eye size={18} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => deleteProject(project._id, project.title)}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Project Image */}
      {project.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Project Description */}
      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
        {project.description.length > 150 
          ? `${project.description.substring(0, 150)}...` 
          : project.description
        }
      </p>

      {/* Technologies */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Project Links */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex space-x-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              <ExternalLink size={14} className="mr-1" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              <Github size={14} className="mr-1" />
              Code
            </a>
          )}
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-xs text-slate-500">Published</span>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-slate-600">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchProjects}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Management</h2>
          <p className="text-slate-600">Manage your portfolio projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add New Project
        </motion.button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Filter size={16} className="inline mr-2" />
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-slate-600">
          Showing {filteredProjects.length} of {projects.length} projects
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm || selectedCategory !== 'All' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first project to showcase your work'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex items-center"
            >
              <Plus size={20} className="mr-2" />
              {searchTerm || selectedCategory !== 'All' ? 'Clear Filters' : 'Add Your First Project'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {projects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-primary-600">{projects.length}</div>
            <div className="text-sm text-slate-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-secondary-600">
              {projects.filter(p => p.category === 'AI').length}
            </div>
            <div className="text-sm text-slate-600">AI Projects</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-accent-600">
              {projects.filter(p => p.liveUrl).length}
            </div>
            <div className="text-sm text-slate-600">Live Demos</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-success-600">
              {projects.filter(p => p.githubUrl).length}
            </div>
            <div className="text-sm text-slate-600">Open Source</div>
          </div>
        </div>
      )}
    </div>
  )
}