import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import { api } from '../../utils/api'
import type { Project } from '../../types'

// Fallback projects data
const FALLBACK_PROJECTS: Project[] = [
  {
    _id: 'neurorag',
    title: 'NeuroRAG',
    description: 'Hackathon-winning conversational AI using retrieval-augmented generation. Judges praised it as "most practical AI application."',
    category: 'AI',
    technologies: ['RAG', 'NLP', 'Python', 'Streamlit'],
    featured: true,
    date: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: 'docconnect',
    title: 'DocConnect & Student Housing',
    description: 'Real-time professor availability tracking + comprehensive housing platform serving 200+ students in Tunisia.',
    category: 'Web Development',
    technologies: ['Spring Boot', 'Angular', 'MySQL', 'React'],
    featured: true,
    date: '2023-09-01T00:00:00.000Z'
  },
  {
    _id: 'helmet-detection',
    title: 'Helmet Detection System',
    description: '95% accuracy real-time safety monitoring using YOLOv8 computer vision for construction site safety.',
    category: 'AI',
    technologies: ['YOLOv8', 'Computer Vision', 'Python', 'Streamlit'],
    featured: true,
    date: '2023-11-01T00:00:00.000Z'
  }
]

interface ProjectsShowcaseProps {
  limit?: number
}

export const ProjectsShowcase = ({ limit }: ProjectsShowcaseProps) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = ['All', 'AI', 'Optimization', 'DevOps', 'Global Impact', 'Web Development']

  // Helper function to get technologies from either 'technologies' or 'techStack'
  const getTechnologies = (project: any): string[] => {
    return project.technologies || project.techStack || []
  }

  // Helper function to normalize project data
  const normalizeProject = (project: any): Project => {
    return {
      ...project,
      _id: project._id || project.id,
      technologies: getTechnologies(project),
      date: project.date || project.createdAt || new Date().toISOString()
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/projects')
      // Extract the projects array from the response
      const rawProjects = response.data?.projects || []
      // Normalize the project data to ensure consistent structure
      const normalizedProjects = rawProjects.map(normalizeProject)
      setProjects(normalizedProjects)
      console.log('Projects loaded from API:', normalizedProjects.length)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.warn('API failed, using fallback data:', errorMessage)
      // Use fallback data if API fails (backend not running)
      setProjects(FALLBACK_PROJECTS)
      setError('') // Clear error since we have fallback data
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    // Safety check: ensure projects is an array
    if (!Array.isArray(projects)) {
      console.warn('Projects is not an array:', projects)
      setFilteredProjects([])
      return
    }
    
    let filtered = [...projects]

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => {
        const technologies = getTechnologies(project)
        return project.category === selectedCategory || 
               technologies.some(tech => tech.toLowerCase().includes(selectedCategory.toLowerCase()))
      })
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project => {
        const technologies = getTechnologies(project)
        return project.title.toLowerCase().includes(term) ||
               project.description.toLowerCase().includes(term) ||
               technologies.some(tech => tech.toLowerCase().includes(term))
      })
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredProjects(filtered)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-slate-600">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Innovative solutions that bridge technology and human impact across multiple domains
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        {!limit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Filter size={16} className="inline mr-2" />
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                variants={cardVariants}
                layout
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-primary-300">
                        {project.category === 'AI' && '🤖'}
                        {project.category === 'Optimization' && '⚡'}
                        {project.category === 'DevOps' && '🔧'}
                        {project.category === 'Global Impact' && '🌍'}
                        {!['AI', 'Optimization', 'DevOps', 'Global Impact'].includes(project.category) && '💻'}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      <Tag size={12} className="mr-1" />
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    {project.description.length > 120 
                      ? `${project.description.substring(0, 120)}...` 
                      : project.description
                    }
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {getTechnologies(project).slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {getTechnologies(project).length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                          +{getTechnologies(project).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-xs text-slate-500 mb-4">
                    <Calendar size={12} className="mr-1" />
                    {new Date(project.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short' 
                    })}
                  </div>

                  {/* Links */}
                  <div className="flex space-x-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* View All Projects Button */}
        {limit && projects.length > limit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="#projects"
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center"
            >
              View All Projects
              <ExternalLink size={20} className="ml-2" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}