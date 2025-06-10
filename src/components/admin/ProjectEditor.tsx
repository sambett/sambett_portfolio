import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Plus, Trash2, Link, Github, Calendar, Tag } from 'lucide-react'
import type { Project } from '../../types'

interface ProjectEditorProps {
  project?: Project | null
  onSave: (project: Partial<Project>) => void
  onCancel: () => void
  loading?: boolean
}

export const ProjectEditor = ({ project, onSave, onCancel, loading = false }: ProjectEditorProps) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'AI',
    technologies: project?.technologies || [],
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    image: project?.image || '',
    date: project?.date ? new Date(project.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })

  const [newTech, setNewTech] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ['AI', 'Optimization', 'DevOps', 'Global Impact', 'Web Development']

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL'
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Describe your project..."
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                <p className="text-sm text-slate-500 ml-auto">{formData.description.length}/500</p>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Technologies *
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Add a technology"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {errors.technologies && <p className="mt-1 text-sm text-red-600">{errors.technologies}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Live URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Link size={16} className="inline mr-1" />
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.liveUrl ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.liveUrl && <p className="mt-1 text-sm text-red-600">{errors.liveUrl}</p>}
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Github size={16} className="inline mr-1" />
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.githubUrl ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="https://github.com/username/repo"
                />
                {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Project Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-slate-600 hover:text-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                loading
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{project ? 'Update Project' : 'Create Project'}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}