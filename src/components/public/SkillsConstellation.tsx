import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, Brain, Server, Globe, Award, Clock, Star, TrendingUp } from 'lucide-react';

interface Skill {
  name: string;
  category: string;
  proficiency: number; // 1-10
  years: number;
  icon?: React.ReactNode;
  color: string;
  projects?: string[];
  certifications?: string[];
  description: string;
}

interface SkillCategory {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  skills: Skill[];
  description: string;
}

export const SkillsConstellation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI & Machine Learning');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillCategories: SkillCategory[] = [
    {
      name: "AI & Machine Learning",
      icon: Brain,
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500",
      description: "Building intelligent systems that solve real-world problems",
      skills: [
        { 
          name: "RAG Systems", 
          category: "AI", 
          proficiency: 9, 
          years: 2, 
          color: "bg-purple-500", 
          projects: ["NeuroRAG"], 
          certifications: ["AI Specialization"],
          description: "Retrieval-Augmented Generation for accurate, source-backed AI responses"
        },
        { 
          name: "Computer Vision", 
          category: "AI", 
          proficiency: 8, 
          years: 2, 
          color: "bg-pink-500", 
          projects: ["Helmet Detection"],
          description: "Object detection and image analysis for safety applications"
        },
        { 
          name: "NLP", 
          category: "AI", 
          proficiency: 8, 
          years: 2, 
          color: "bg-indigo-500", 
          projects: ["NeuroRAG"],
          description: "Natural Language Processing for conversational AI systems"
        },
        { 
          name: "TensorFlow", 
          category: "AI", 
          proficiency: 7, 
          years: 1.5, 
          color: "bg-orange-500",
          description: "Deep learning framework for scalable AI model development"
        },
        { 
          name: "PyTorch", 
          category: "AI", 
          proficiency: 7, 
          years: 1, 
          color: "bg-red-500",
          description: "Dynamic neural network framework for research and production"
        },
        { 
          name: "Streamlit", 
          category: "AI", 
          proficiency: 8, 
          years: 1.5, 
          color: "bg-green-500", 
          projects: ["NeuroRAG"],
          description: "Rapid AI application prototyping and deployment"
        }
      ]
    },
    {
      name: "Frontend Development",
      icon: Code,
      color: "text-cyan-400", 
      gradient: "from-cyan-500 to-blue-500",
      description: "Creating beautiful, interactive user experiences",
      skills: [
        { 
          name: "React", 
          category: "Frontend", 
          proficiency: 9, 
          years: 3, 
          color: "bg-cyan-500", 
          projects: ["Portfolio", "DocConnect"],
          description: "Component-based UI development with modern React patterns"
        },
        { 
          name: "TypeScript", 
          category: "Frontend", 
          proficiency: 8, 
          years: 2, 
          color: "bg-blue-500", 
          projects: ["Portfolio"],
          description: "Type-safe JavaScript for robust application development"
        },
        { 
          name: "Framer Motion", 
          category: "Frontend", 
          proficiency: 8, 
          years: 1, 
          color: "bg-purple-500", 
          projects: ["Portfolio"],
          description: "Advanced animations and micro-interactions"
        },
        { 
          name: "Tailwind CSS", 
          category: "Frontend", 
          proficiency: 9, 
          years: 2, 
          color: "bg-teal-500", 
          projects: ["Portfolio", "DocConnect"],
          description: "Utility-first CSS framework for rapid UI development"
        },
        { 
          name: "JavaScript", 
          category: "Frontend", 
          proficiency: 9, 
          years: 4, 
          color: "bg-yellow-500",
          description: "Modern ES6+ JavaScript for dynamic web applications"
        },
        { 
          name: "HTML/CSS", 
          category: "Frontend", 
          proficiency: 9, 
          years: 4, 
          color: "bg-orange-500",
          description: "Semantic markup and responsive styling fundamentals"
        }
      ]
    },
    {
      name: "Backend & Database",
      icon: Server,
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500", 
      description: "Building scalable server-side solutions and data management",
      skills: [
        { 
          name: "Node.js", 
          category: "Backend", 
          proficiency: 8, 
          years: 2, 
          color: "bg-green-500", 
          projects: ["DocConnect", "Portfolio API"],
          description: "Server-side JavaScript runtime for scalable applications"
        },
        { 
          name: "Express.js", 
          category: "Backend", 
          proficiency: 8, 
          years: 2, 
          color: "bg-gray-600", 
          projects: ["DocConnect"],
          description: "Minimal web framework for Node.js API development"
        },
        { 
          name: "MongoDB", 
          category: "Backend", 
          proficiency: 7, 
          years: 1.5, 
          color: "bg-green-600", 
          projects: ["DocConnect"],
          description: "NoSQL database for flexible, document-based data storage"
        },
        { 
          name: "PostgreSQL", 
          category: "Backend", 
          proficiency: 6, 
          years: 1, 
          color: "bg-blue-600",
          description: "Relational database for complex data relationships"
        },
        { 
          name: "REST APIs", 
          category: "Backend", 
          proficiency: 8, 
          years: 2, 
          color: "bg-indigo-600", 
          projects: ["DocConnect"],
          description: "RESTful service design and implementation"
        },
        { 
          name: "Authentication", 
          category: "Backend", 
          proficiency: 7, 
          years: 1.5, 
          color: "bg-red-600", 
          projects: ["Portfolio Admin"],
          description: "Secure user authentication and authorization systems"
        }
      ]
    },
    {
      name: "Tools & DevOps",
      icon: Database,
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500",
      description: "Development tools and deployment infrastructure",
      skills: [
        { 
          name: "Git/GitHub", 
          category: "DevOps", 
          proficiency: 9, 
          years: 4, 
          color: "bg-gray-700",
          description: "Version control and collaborative development workflows"
        },
        { 
          name: "Docker", 
          category: "DevOps", 
          proficiency: 6, 
          years: 1, 
          color: "bg-blue-600",
          description: "Containerization for consistent deployment environments"
        },
        { 
          name: "Vercel", 
          category: "DevOps", 
          proficiency: 8, 
          years: 1.5, 
          color: "bg-black", 
          projects: ["Portfolio"],
          description: "Modern deployment platform for frontend applications"
        },
        { 
          name: "VS Code", 
          category: "DevOps", 
          proficiency: 9, 
          years: 4, 
          color: "bg-blue-500",
          description: "Advanced code editing with extensions and debugging"
        },
        { 
          name: "Figma", 
          category: "DevOps", 
          proficiency: 7, 
          years: 2, 
          color: "bg-purple-600",
          description: "UI/UX design and prototyping for development"
        },
        { 
          name: "Postman", 
          category: "DevOps", 
          proficiency: 8, 
          years: 2, 
          color: "bg-orange-500",
          description: "API testing and documentation tools"
        }
      ]
    },
    {
      name: "Languages & Global",
      icon: Globe,
      color: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-500",
      description: "Cross-cultural communication and global collaboration",
      skills: [
        { 
          name: "Arabic", 
          category: "Language", 
          proficiency: 10, 
          years: 22, 
          color: "bg-green-600",
          description: "Native language enabling Middle East and North Africa engagement"
        },
        { 
          name: "French", 
          category: "Language", 
          proficiency: 9, 
          years: 15, 
          color: "bg-blue-600",
          description: "Professional fluency for francophone market opportunities"
        },
        { 
          name: "English", 
          category: "Language", 
          proficiency: 9, 
          years: 10, 
          color: "bg-red-600",
          description: "International communication and technical documentation"
        },
        { 
          name: "Turkish", 
          category: "Language", 
          proficiency: 6, 
          years: 1, 
          color: "bg-red-500",
          description: "Conversational level from AIESEC volunteer experience"
        },
        { 
          name: "Spanish", 
          category: "Language", 
          proficiency: 5, 
          years: 2, 
          color: "bg-yellow-600",
          description: "Basic communication for Latin American markets"
        },
        { 
          name: "Cross-cultural", 
          category: "Global", 
          proficiency: 9, 
          years: 3, 
          color: "bg-purple-600", 
          projects: ["AIESEC Volunteer"],
          description: "Multicultural team leadership and global project management"
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const getProficiencyLevel = (proficiency: number) => {
    if (proficiency >= 9) return { label: "Expert", color: "text-emerald-400" };
    if (proficiency >= 7) return { label: "Advanced", color: "text-blue-400" };
    if (proficiency >= 5) return { label: "Intermediate", color: "text-yellow-400" };
    return { label: "Beginner", color: "text-orange-400" };
  };

  const selectedCategoryData = skillCategories.find(cat => cat.name === selectedCategory) || skillCategories[0];

  return (
    <div className="min-h-screen px-4 py-12">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Skills Constellation
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A universe of technologies, languages, and expertise across AI, development, and global collaboration.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.name;
            
            return (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} border-white/40 text-white shadow-lg`
                    : `bg-white/5 border-white/20 ${category.color} hover:bg-white/10 hover:border-white/30`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">{category.name}</span>
                <span className="font-medium sm:hidden">{category.name.split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Header */}
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                {React.createElement(selectedCategoryData.icon, { 
                  className: `w-8 h-8 ${selectedCategoryData.color}` 
                })}
                <h3 className="text-3xl font-bold text-white">{selectedCategoryData.name}</h3>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {selectedCategoryData.description}
              </p>
            </motion.div>

            {/* Skills Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {selectedCategoryData.skills.map((skill, index) => {
                const proficiencyInfo = getProficiencyLevel(skill.proficiency);
                const isHovered = hoveredSkill === skill.name;
                
                return (
                  <motion.div
                    key={skill.name}
                    className={`relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer ${
                      isHovered ? 'ring-2 ring-cyan-400/50' : ''
                    }`}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Skill Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-3 h-3 rounded-full ${skill.color}`}
                          style={{ 
                            boxShadow: `0 0 10px ${skill.color.replace('bg-', 'rgba(')}-500, 0.5)` 
                          }}
                        />
                        <h4 className="text-lg font-bold text-white">{skill.name}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${proficiencyInfo.color}`}>
                          {proficiencyInfo.label}
                        </span>
                        <div className="text-gray-400 text-sm">
                          {skill.proficiency}/10
                        </div>
                      </div>
                    </div>

                    {/* Proficiency Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${selectedCategoryData.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency * 10}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {skill.description}
                    </p>

                    {/* Experience & Projects */}
                    <div className="space-y-3">
                      {/* Experience */}
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {skill.years} year{skill.years !== 1 ? 's' : ''} experience
                        </span>
                      </div>

                      {/* Projects */}
                      {skill.projects && skill.projects.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 text-purple-400 mb-2">
                            <Star className="w-4 h-4" />
                            <span className="text-sm font-medium">Projects</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skill.projects.map((project, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-400/30"
                              >
                                {project}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {skill.certifications && skill.certifications.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-medium">Certified</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skill.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs border border-yellow-400/30"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hover Enhancement */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${selectedCategoryData.gradient} opacity-5 rounded-2xl`} />
                          
                          {/* Floating particles */}
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
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
                                left: `${15 + i * 10}%`,
                                bottom: '15%',
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Category Stats */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={itemVariants}
            >
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {selectedCategoryData.skills.length}
                </div>
                <div className="text-gray-300">Technologies</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {Math.round(selectedCategoryData.skills.reduce((acc, skill) => acc + skill.proficiency, 0) / selectedCategoryData.skills.length * 10)}%
                </div>
                <div className="text-gray-300">Avg Proficiency</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {Math.round(selectedCategoryData.skills.reduce((acc, skill) => acc + skill.years, 0) / selectedCategoryData.skills.length * 10) / 10}
                </div>
                <div className="text-gray-300">Avg Experience</div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Overall Philosophy */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10"
          variants={itemVariants}
        >
          <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Continuous Growth Philosophy</h3>
          <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto text-lg">
            Each skill in my constellation serves a purpose in building AI that bridges cultures and solves real problems. 
            From technical expertise in machine learning to cross-cultural communication, every capability contributes 
            to creating technology that truly serves humanity.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};