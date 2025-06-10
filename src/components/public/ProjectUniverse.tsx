// Fixed TypeScript build issue - removed unused variables
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Award, Users, Brain, Leaf, Search, Filter, X } from 'lucide-react';

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
          color: 'text-blue-400'
        };
      case 'optimization':
        return {
          gradient: 'from-green-500 via-emerald-500 to-green-600',
          bg: 'bg-green-900/20',
          border: 'border-green-400/30',
          icon: Leaf,
          color: 'text-green-400'
        };
      case 'social':
        return {
          gradient: 'from-red-500 via-pink-500 to-red-600',
          bg: 'bg-red-900/20',
          border: 'border-red-400/30',
          icon: Users,
          color: 'text-red-400'
        };
      default:
        return {
          gradient: 'from-purple-500 via-indigo-500 to-purple-600',
          bg: 'bg-purple-900/20',
          border: 'border-purple-400/30',
          icon: Brain,
          color: 'text-purple-400'
        };
    }
  };

  const handleProjectClick = (project: Project) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedProject(project);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 1500);
  };

  const closeProject = () => {
    setSelectedProject(null);
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

        {/* Black Hole Transition & Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Enhanced Cosmic Background */}
              <motion.div
                className="fixed inset-0 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Enhanced Multi-layered Cosmic Background - Dynamically Themed */}
                <div className="absolute inset-0">
                  {/* Base cosmic gradient with category theme */}
                  <motion.div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, 
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-900')} 0%, 
                        #000000 40%, 
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-800')} 100%)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Project-themed gradient overlay */}
                  <motion.div 
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(circle at 30% 40%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 0%, transparent 50%), 
                        radial-gradient(circle at 70% 60%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-700')} 0%, transparent 80%)
                      `,
                      opacity: 0.15
                    }}
                    animate={{
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Themed twinkling stars */}
                  <div className="absolute inset-0">
                    {[...Array(100)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: Math.random() * 3 + 1 + 'px',
                          height: Math.random() * 3 + 1 + 'px',
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          background: Math.random() > 0.7 
                            ? getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300')
                            : '#ffffff'
                        }}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: Math.random() * 4 + 2,
                          repeat: Infinity,
                          delay: Math.random() * 5,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Floating cosmic dust in category theme */}
                  <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-300'),
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          x: [0, Math.random() * 300 - 150],
                          y: [0, Math.random() * 300 - 150],
                          opacity: [0, 0.8, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: Math.random() * 10 + 6,
                          repeat: Infinity,
                          delay: Math.random() * 3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Animated themed nebula clouds */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse 800px 400px at 25% 30%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 0%, transparent 50%), 
                        radial-gradient(ellipse 600px 300px at 75% 70%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 0%, transparent 60%),
                        radial-gradient(ellipse 400px 600px at 10% 80%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 0%, transparent 70%)
                      `,
                      opacity: 0.08
                    }}
                    animate={{
                      opacity: [0.05, 0.15, 0.05],
                      scale: [1, 1.1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Category-themed rotating galaxy arms */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(
                        from 0deg, 
                        transparent 0deg, 
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 45deg, 
                        transparent 90deg, 
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-500')} 180deg,
                        transparent 225deg,
                        ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 270deg,
                        transparent 315deg
                      )`,
                      maskImage: 'radial-gradient(circle at center, transparent 40%, black 70%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 70%, transparent 100%)',
                      opacity: 0.15
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Pulsing central glow with category theme */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{
                      background: `radial-gradient(circle, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-400')} 0%, ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 30%, transparent 70%)`
                    }}
                    animate={{
                      scale: [0.6, 1.4, 0.6],
                      opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Category-specific decorative elements */}
                  {selectedProject.category.toLowerCase() === 'ai' && (
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 50px,
                          ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 50px,
                          ${getCategoryTheme(selectedProject.category).color.replace('text-', '').replace('-400', '-600')} 51px
                        )`
                      }}
                      animate={{ x: [0, 100], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {selectedProject.category.toLowerCase() === 'optimization' && (
                    <motion.div className="absolute inset-0">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-px bg-gradient-to-b from-transparent via-green-400 to-transparent"
                          style={{
                            left: `${10 + i * 10}%`,
                            height: '100%',
                          }}
                          animate={{
                            opacity: [0, 0.6, 0],
                            scaleY: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Project Detail Content */}
                <motion.div
                  className="relative z-10 flex items-center justify-center min-h-screen p-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="max-w-4xl mx-auto bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-4xl font-bold text-white mb-2">{selectedProject.title}</h3>
                        <div className={`text-lg ${getCategoryTheme(selectedProject.category).color}`}>
                          {selectedProject.category}
                        </div>
                      </div>
                      <button
                        onClick={closeProject}
                        className="text-gray-400 hover:text-white text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-3">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full border border-blue-400/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-white mb-3">Impact & Results</h4>
                        <p className="text-gray-300">{selectedProject.impact}</p>
                        
                        {selectedProject.awards && (
                          <div className="mt-4">
                            <h5 className="text-lg font-medium text-yellow-400 mb-2">Awards</h5>
                            {selectedProject.awards.map((award, index) => (
                              <div key={index} className="text-yellow-300">{award}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-8">
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Github className="w-5 h-5" />
                          <span>View Code</span>
                        </a>
                      )}
                      {selectedProject.demoUrl && (
                        <a
                          href={selectedProject.demoUrl}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};