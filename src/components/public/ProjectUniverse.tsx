// Enhanced ProjectUniverse with improved modal experience
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Github, Award, Users, Brain, Leaf, Search, Filter, X, 
  Calendar, Target, Code2, Play, Info, ArrowRight, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  impact: string;
  awards?: string[];
  featured: boolean;
  createdAt?: string;
  images?: string[];
}

export const ProjectUniverse: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Enhanced modal states
  const [activeSection, setActiveSection] = useState<'overview' | 'technical' | 'impact' | 'showcase'>('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Load projects from JSON
    fetch('/data/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
        setFilteredProjects(data.projects);
      })
      .catch(() => {
        // Fallback data
        const fallbackProjects = [
          {
            id: "neurorag",
            title: "NeuroRAG",
            description: "Hackathon-winning conversational AI using retrieval-augmented generation. Judges praised it as 'most practical AI application.'",
            category: "AI",
            techStack: ["RAG", "NLP", "Python", "Streamlit"],
            impact: "Most practical AI application according to judges",
            awards: ["🏆 Hackathon Winner"],
            featured: true
          }
        ];
        setProjects(fallbackProjects);
        setFilteredProjects(fallbackProjects);
      });
  }, []);

  // Filter projects based on search term, category, and technology
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Technology filter
    if (selectedTech !== 'all') {
      filtered = filtered.filter(project =>
        project.techStack.some(tech => tech.toLowerCase().includes(selectedTech.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedTech]);

  // Get unique categories and technologies from projects
  const getUniqueCategories = () => {
    const categories = projects.map(p => p.category);
    return [...new Set(categories)];
  };

  const getUniqueTechnologies = () => {
    const techs = projects.flatMap(p => p.techStack);
    return [...new Set(techs)].sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTech('all');
  };

  const getCategoryTheme = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ai':
        return {
          gradient: 'from-blue-500 via-cyan-500 to-blue-600',
          bg: 'bg-blue-900/20',
          border: 'border-blue-400/30',
          icon: Brain,
          color: 'text-blue-400',
          accent: 'blue'
        };
      case 'optimization':
        return {
          gradient: 'from-green-500 via-emerald-500 to-green-600',
          bg: 'bg-green-900/20',
          border: 'border-green-400/30',
          icon: Leaf,
          color: 'text-green-400',
          accent: 'green'
        };
      case 'social':
        return {
          gradient: 'from-red-500 via-pink-500 to-red-600',
          bg: 'bg-red-900/20',
          border: 'border-red-400/30',
          icon: Users,
          color: 'text-red-400',
          accent: 'red'
        };
      case 'sustainability':
        return {
          gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
          bg: 'bg-emerald-900/20',
          border: 'border-emerald-400/30',
          icon: Leaf,
          color: 'text-emerald-400',
          accent: 'emerald'
        };
      default:
        return {
          gradient: 'from-purple-500 via-indigo-500 to-purple-600',
          bg: 'bg-purple-900/20',
          border: 'border-purple-400/30',
          icon: Brain,
          color: 'text-purple-400',
          accent: 'purple'
        };
    }
  };

  const handleProjectClick = (project: Project) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedProject(project);
    setActiveSection('overview'); // Reset to overview
    setCurrentImageIndex(0); // Reset image index
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 1500);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'technical', label: 'Technical', icon: Code2 },
    { id: 'impact', label: 'Impact', icon: Target },
    { id: 'showcase', label: 'Showcase', icon: Play }
  ] as const;

  const nextImage = () => {
    if (selectedProject?.images && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedProject?.images && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Subtle Grid/Spider Web Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 25% 75%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px, 120px 120px, 120px 120px'
        }}></div>
        
        {/* Spider web connecting lines */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos(i * Math.PI / 4) * 40}%`}
              y2={`${50 + Math.sin(i * Math.PI / 4) * 40}%`}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: i * 0.2 }}
            />
          ))}
          
          {/* Concentric web circles */}
          {[20, 30, 40].map((radius, i) => (
            <motion.circle
              key={i}
              cx="50%"
              cy="50%"
              r={`${radius}%`}
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, delay: i * 0.5 }}
            />
          ))}
        </svg>
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 px-4"
          variants={cardVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Project Universe
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Each project is a different galaxy in my universe of solutions. 
            Click to enter their world and discover the impact they create.
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="mb-8 px-4"
          variants={cardVariants}
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="text-center mb-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 mx-auto px-6 py-2 bg-white/10 border border-white/20 rounded-full text-gray-300 hover:text-white hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      >
                        <option value="all" className="bg-gray-800">All Categories</option>
                        {getUniqueCategories().map(category => (
                          <option key={category} value={category} className="bg-gray-800">{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Technology Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Technology</label>
                      <select
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      >
                        <option value="all" className="bg-gray-800">All Technologies</option>
                        {getUniqueTechnologies().map(tech => (
                          <option key={tech} value={tech} className="bg-gray-800">{tech}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters & Clear */}
                  {(searchTerm || selectedCategory !== 'all' || selectedTech !== 'all') && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-400">Active filters:</span>
                        {searchTerm && (
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-400/30">
                            Search: "{searchTerm}"
                          </span>
                        )}
                        {selectedCategory !== 'all' && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30">
                            Category: {selectedCategory}
                          </span>
                        )}
                        {selectedTech !== 'all' && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-400/30">
                            Tech: {selectedTech}
                          </span>
                        )}
                        <button
                          onClick={clearFilters}
                          className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-400/30 hover:bg-red-500/30 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-400">
              Showing {filteredProjects.length} of {projects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4"
          variants={containerVariants}
        >
          {filteredProjects.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12"
              variants={cardVariants}
            >
              <div className="text-gray-400 text-lg mb-4">No projects found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30 hover:bg-cyan-500/30 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            filteredProjects.map((project) => {
            const theme = getCategoryTheme(project.category);
            const IconComponent = theme.icon;

            return (
              <motion.div
                key={project.id}
                className={`relative p-4 sm:p-6 rounded-2xl ${theme.bg} ${theme.border} border backdrop-blur-sm cursor-pointer group overflow-hidden`}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleProjectClick(project)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Category Icon */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.color}`} />
                  {project.featured && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Featured</span>
                    </div>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-300 line-clamp-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {project.techStack.slice(0, 2).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${theme.bg} ${theme.color} border ${theme.border}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 2 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      +{project.techStack.length - 2}
                    </span>
                  )}
                </div>

                {/* Impact Preview */}
                <div className={`text-xs sm:text-sm ${theme.color} font-medium line-clamp-2`}>
                  {project.impact}
                </div>

                {/* Hover Effect - Floating Particles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${theme.color.replace('text-', 'bg-')} rounded-full`}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      style={{
                        left: `${10 + i * 8}%`,
                        bottom: '20%',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          }))}
        </motion.div>

        {/* Enhanced Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Backdrop with blur effect */}
              <motion.div
                className="fixed inset-0 z-40 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={closeProject}
              />
              
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Spectacular Cosmic Background with Category Theme */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Dynamic base gradient that shifts with category */}
                  <motion.div 
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(circle at 20% 30%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-700')} 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-800')} 0%, transparent 40%),
                        linear-gradient(135deg, #000000 0%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-900')} 100%)
                      `
                    }}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  
                  {/* Flowing energy streams */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(45deg, transparent 0%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 1%, transparent 2%),
                        linear-gradient(-45deg, transparent 0%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 1%, transparent 2%)
                      `,
                      backgroundSize: '200px 200px, 250px 250px',
                      opacity: 0.1
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Premium twinkling stars with depth */}
                  <div className="absolute inset-0">
                    {[...Array(120)].map((_, i) => {
                      const size = Math.random() * 4 + 1;
                      const isThemed = Math.random() > 0.6;
                      return (
                        <motion.div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            width: size + 'px',
                            height: size + 'px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: isThemed
                              ? getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300')
                              : '#ffffff',
                            boxShadow: isThemed
                              ? `0 0 ${size * 3}px ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')}`
                              : `0 0 ${size * 2}px rgba(255,255,255,0.8)`
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1.2, 0.5],
                          }}
                          transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "easeInOut",
                          }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Cosmic dust clouds */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse 600px 200px at 30% 20%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 0%, transparent 70%),
                        radial-gradient(ellipse 400px 300px at 70% 80%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 0%, transparent 60%),
                        radial-gradient(ellipse 500px 150px at 10% 60%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-700')} 0%, transparent 80%)
                      `,
                      opacity: 0.15
                    }}
                    animate={{
                      opacity: [0.1, 0.25, 0.1],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Dynamic spiral galaxy */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(
                        from 0deg, 
                        transparent 0deg, 
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300')} 15deg, 
                        transparent 30deg,
                        transparent 60deg,
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 90deg, 
                        transparent 120deg,
                        transparent 180deg,
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 200deg,
                        transparent 240deg,
                        transparent 300deg,
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300')} 330deg,
                        transparent 360deg
                      )`,
                      maskImage: 'radial-gradient(circle at center, transparent 30%, black 60%, transparent 85%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 60%, transparent 85%)',
                      opacity: 0.2
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Floating energy orbs */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full blur-sm"
                      style={{
                        width: Math.random() * 60 + 20 + 'px',
                        height: Math.random() * 60 + 20 + 'px',
                        background: `radial-gradient(circle, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 0%, transparent 70%)`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 2,
                      }}
                    />
                  ))}
                </div>

              {/* Main Modal Container with spectacular entrance */}
              <motion.div
                className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden"
                initial={{ 
                  scale: 0.3, 
                  opacity: 0, 
                  rotateX: -30,
                  rotateY: 45,
                  z: -1000
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotateX: 0,
                  rotateY: 0,
                  z: 0
                }}
                exit={{ 
                  scale: 0.2, 
                  opacity: 0, 
                  rotateX: 30,
                  rotateY: -45,
                  z: -1000
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Glass morphism container */}
                <motion.div
                  className="w-full h-full rounded-3xl border backdrop-blur-2xl shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%, 
                      rgba(255, 255, 255, 0.05) 100%
                    )`,
                    borderColor: `${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')}40`,
                    boxShadow: `
                      0 0 100px ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')}30,
                      inset 0 1px 0 rgba(255, 255, 255, 0.2),
                      0 20px 60px rgba(0, 0, 0, 0.5)
                    `
                  }}
                  initial={{ borderWidth: 0 }}
                  animate={{ borderWidth: 2 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                {/* Header */}
                <div className={`relative p-6 border-b border-white/10 bg-gradient-to-r ${getCategoryTheme(selectedProject.category).gradient} bg-opacity-10`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`p-3 rounded-2xl ${getCategoryTheme(selectedProject.category).bg} ${getCategoryTheme(selectedProject.category).border} border`}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {React.createElement(getCategoryTheme(selectedProject.category).icon, { 
                          className: `w-8 h-8 ${getCategoryTheme(selectedProject.category).color}` 
                        })}
                      </motion.div>
                      <div>
                        <motion.h2 
                          className="text-3xl md:text-4xl font-bold text-white mb-2"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {selectedProject.title}
                        </motion.h2>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryTheme(selectedProject.category).bg} ${getCategoryTheme(selectedProject.category).color} ${getCategoryTheme(selectedProject.category).border} border`}>
                            {selectedProject.category}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(selectedProject.createdAt)}</span>
                          </div>
                          {selectedProject.featured && (
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Award className="w-4 h-4" />
                              <span className="text-sm">Featured</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={closeProject}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Section Navigation */}
                  <motion.div 
                    className="flex space-x-1 mt-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {sections.map((section) => {
                      const SectionIcon = section.icon;
                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            activeSection === section.id
                              ? `${getCategoryTheme(selectedProject.category).bg} ${getCategoryTheme(selectedProject.category).color} ${getCategoryTheme(selectedProject.category).border} border`
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SectionIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.label}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Content Area with enhanced styling */}
                <motion.div 
                  className="p-6 h-96 overflow-y-auto custom-scrollbar relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Content background pattern */}
                  <div 
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300')} 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {activeSection === 'overview' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Project Description</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {selectedProject.description}
                            </p>
                          </div>
                          
                          {selectedProject.awards && selectedProject.awards.length > 0 && (
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-3">Recognition</h3>
                              <div className="space-y-2">
                                {selectedProject.awards.map((award, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <Award className="w-5 h-5 text-yellow-400" />
                                    <span className="text-yellow-300">{award}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeSection === 'technical' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Technology Stack</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {selectedProject.techStack.map((tech, index) => (
                                <motion.div
                                  key={index}
                                  className={`p-3 text-center rounded-lg ${getCategoryTheme(selectedProject.category).bg} ${getCategoryTheme(selectedProject.category).border} border backdrop-blur-sm`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                >
                                  <span className={`text-sm font-medium ${getCategoryTheme(selectedProject.category).color}`}>{tech}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Architecture Overview</h3>
                            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                              <p className="text-gray-300">
                                This project leverages a modern tech stack with {selectedProject.techStack.join(', ')} to deliver 
                                scalable and efficient solutions. The architecture emphasizes performance, maintainability, 
                                and user experience.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === 'impact' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Impact & Results</h3>
                            <div className={`p-6 rounded-xl ${getCategoryTheme(selectedProject.category).bg} ${getCategoryTheme(selectedProject.category).border} border backdrop-blur-sm`}>
                              <p className={`text-lg ${getCategoryTheme(selectedProject.category).color} font-medium`}>
                                {selectedProject.impact}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                              <h4 className="text-lg font-semibold text-white mb-2">Problem Solved</h4>
                              <p className="text-gray-300">
                                Addressing real-world challenges through innovative technology solutions
                                that create measurable positive outcomes.
                              </p>
                            </div>

                            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                              <h4 className="text-lg font-semibold text-white mb-2">Future Potential</h4>
                              <p className="text-gray-300">
                                This solution has the potential to scale and adapt to similar challenges
                                across different domains and use cases.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === 'showcase' && (
                        <div className="space-y-6">
                          {selectedProject.images && selectedProject.images.length > 0 ? (
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-4">Project Gallery</h3>
                              <div className="relative">
                                <motion.img
                                  key={currentImageIndex}
                                  src={selectedProject.images[currentImageIndex]}
                                  alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                                  className="w-full h-64 object-cover rounded-lg border border-gray-700"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                />
                                
                                {selectedProject.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={prevImage}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={nextImage}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                              </div>
                              
                              {selectedProject.images.length > 1 && (
                                <div className="flex justify-center space-x-2 mt-4">
                                  {selectedProject.images.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentImageIndex(index)}
                                      className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentImageIndex 
                                          ? getCategoryTheme(selectedProject.category).color.replace('text-', 'bg-') 
                                          : 'bg-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="text-gray-400 text-lg mb-4">Visual assets coming soon</div>
                              <p className="text-gray-500">Screenshots and demos will be added to showcase this project</p>
                            </div>
                          )}

                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Live Links</h3>
                            <div className="flex flex-wrap gap-4">
                              {selectedProject.githubUrl && (
                                <motion.a
                                  href={selectedProject.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Github className="w-5 h-5" />
                                  <span>View Source Code</span>
                                  <ArrowRight className="w-4 h-4" />
                                </motion.a>
                              )}
                              
                              {selectedProject.demoUrl && (
                                <motion.a
                                  href={selectedProject.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${getCategoryTheme(selectedProject.category).gradient} hover:opacity-90 rounded-lg transition-opacity text-white font-medium`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ExternalLink className="w-5 h-5" />
                                  <span>Live Demo</span>
                                  <ArrowRight className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                </motion.div>
              </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};