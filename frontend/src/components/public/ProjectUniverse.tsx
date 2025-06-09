import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Award, Users, Brain, Leaf } from 'lucide-react';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Load projects from JSON
    fetch('/data/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data.projects))
      .catch(() => {
        // Fallback data
        setProjects([
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
        ]);
      });
  }, []);

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={cardVariants}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Project Universe
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Each project is a different galaxy in my universe of solutions. 
            Click to enter their world and discover the impact they create.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {projects.map((project) => {
            const theme = getCategoryTheme(project.category);
            const IconComponent = theme.icon;

            return (
              <motion.div
                key={project.id}
                className={`relative p-6 rounded-2xl ${theme.bg} ${theme.border} border backdrop-blur-sm cursor-pointer group overflow-hidden`}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleProjectClick(project)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Category Icon */}
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`w-8 h-8 ${theme.color}`} />
                  {project.featured && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Featured</span>
                    </div>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${theme.bg} ${theme.color} border ${theme.border}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Impact Preview */}
                <div className={`text-sm ${theme.color} font-medium`}>
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
          })}
        </motion.div>

        {/* Black Hole Transition & Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Black Hole Effect */}
              <motion.div
                className="fixed inset-0 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-black">
                  {/* Spiral Effect */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0deg, ${getCategoryTheme(selectedProject.category).gradient.split(' ')[1]} 180deg, transparent 360deg)`,
                    }}
                  />
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