import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  BarChart3, 
  Users, 
  MessageSquare, 
  ExternalLink,
  LogOut,
  Settings
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
  const [activeTab, setActiveTab] = useState('projects')
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0,
    totalExperiences: 0
  })

  const categories = ['All', 'AI', 'Optimization', 'DevOps', 'Global Impact', 'Web Development', 'Sustainability', 'Social']

  const tabs = [
    { id: 'projects', label: 'Projects', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

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
        // Show success message
        alert('Project deleted successfully!')
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const handleLogout = () => {
    logout()
  }

  const StatCard = ({ icon: Icon, label, value, change }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              ↗ {change}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon size={24} className="text-blue-600" />
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
            onClick={() => alert('Edit functionality coming soon!')}
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

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BarChart3}
                label="Total Projects"
                value={stats.totalProjects}
              />
              <StatCard
                icon={Eye}
                label="Published"
                value={stats.publishedProjects}
              />
              <StatCard
                icon={MessageSquare}
                label="Featured"
                value={stats.featuredProjects}
              />
              <StatCard
                icon={Users}
                label="Experiences"
                value={stats.totalExperiences}
              />
            </div>

            {/* Projects Management */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <h2 className="text-xl font-bold text-slate-900">Manage Projects</h2>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => alert('Add project functionality coming soon!')}
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
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
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
                      onClick={() => alert('Add project functionality coming soon!')}
                    >
                      <Plus size={20} className="mr-2" />
                      Add New Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Messages</h2>
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600">Message management coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Analytics Dashboard</h2>
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600">Analytics dashboard coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Settings</h2>
            <div className="text-center py-12">
              <Settings size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}