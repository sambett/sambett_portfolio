import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, Brain, Server, Globe, Award } from 'lucide-react';

interface Skill {
  name: string;
  category: string;
  proficiency: number; // 1-10
  years: number;
  icon?: React.ReactNode;
  color: string;
  projects?: string[];
  certifications?: string[];
}

interface SkillCategory {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  skills: Skill[];
}

export const SkillsConstellation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillCategories: SkillCategory[] = [
    {
      name: "AI & Machine Learning",
      icon: Brain,
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500",
      skills: [
        { name: "RAG Systems", category: "AI", proficiency: 9, years: 2, color: "bg-purple-500", projects: ["NeuroRAG"], certifications: ["AI Specialization"] },
        { name: "Computer Vision", category: "AI", proficiency: 8, years: 2, color: "bg-pink-500", projects: ["Helmet Detection"] },
        { name: "NLP", category: "AI", proficiency: 8, years: 2, color: "bg-indigo-500", projects: ["NeuroRAG"] },
        { name: "TensorFlow", category: "AI", proficiency: 7, years: 1.5, color: "bg-orange-500" },
        { name: "PyTorch", category: "AI", proficiency: 7, years: 1, color: "bg-red-500" },
        { name: "Streamlit", category: "AI", proficiency: 8, years: 1.5, color: "bg-green-500", projects: ["NeuroRAG"] }
      ]
    },
    {
      name: "Frontend Development",
      icon: Code,
      color: "text-cyan-400", 
      gradient: "from-cyan-500 to-blue-500",
      skills: [
        { name: "React", category: "Frontend", proficiency: 9, years: 3, color: "bg-cyan-500", projects: ["Portfolio", "DocConnect"] },
        { name: "TypeScript", category: "Frontend", proficiency: 8, years: 2, color: "bg-blue-500", projects: ["Portfolio"] },
        { name: "Framer Motion", category: "Frontend", proficiency: 8, years: 1, color: "bg-purple-500", projects: ["Portfolio"] },
        { name: "Tailwind CSS", category: "Frontend", proficiency: 9, years: 2, color: "bg-teal-500", projects: ["Portfolio", "DocConnect"] },
        { name: "JavaScript", category: "Frontend", proficiency: 9, years: 4, color: "bg-yellow-500" },
        { name: "HTML/CSS", category: "Frontend", proficiency: 9, years: 4, color: "bg-orange-500" }
      ]
    },
    {
      name: "Backend & Database",
      icon: Server,
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500", 
      skills: [
        { name: "Node.js", category: "Backend", proficiency: 8, years: 2, color: "bg-green-500", projects: ["DocConnect", "Portfolio API"] },
        { name: "Express.js", category: "Backend", proficiency: 8, years: 2, color: "bg-gray-600", projects: ["DocConnect"] },
        { name: "MongoDB", category: "Backend", proficiency: 7, years: 1.5, color: "bg-green-600", projects: ["DocConnect"] },
        { name: "PostgreSQL", category: "Backend", proficiency: 6, years: 1, color: "bg-blue-600" },
        { name: "REST APIs", category: "Backend", proficiency: 8, years: 2, color: "bg-indigo-600", projects: ["DocConnect"] },
        { name: "Authentication", category: "Backend", proficiency: 7, years: 1.5, color: "bg-red-600", projects: ["Portfolio Admin"] }
      ]
    },
    {
      name: "Tools & DevOps",
      icon: Database,
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500",
      skills: [
        { name: "Git/GitHub", category: "DevOps", proficiency: 9, years: 4, color: "bg-gray-700" },
        { name: "Docker", category: "DevOps", proficiency: 6, years: 1, color: "bg-blue-600" },
        { name: "Vercel", category: "DevOps", proficiency: 8, years: 1.5, color: "bg-black", projects: ["Portfolio"] },
        { name: "VS Code", category: "DevOps", proficiency: 9, years: 4, color: "bg-blue-500" },
        { name: "Figma", category: "DevOps", proficiency: 7, years: 2, color: "bg-purple-600" },
        { name: "Postman", category: "DevOps", proficiency: 8, years: 2, color: "bg-orange-500" }
      ]
    },
    {
      name: "Languages & Global",
      icon: Globe,
      color: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-500",
      skills: [
        { name: "Arabic", category: "Language", proficiency: 10, years: 22, color: "bg-green-600" },
        { name: "French", category: "Language", proficiency: 9, years: 15, color: "bg-blue-600" },
        { name: "English", category: "Language", proficiency: 9, years: 10, color: "bg-red-600" },
        { name: "Turkish", category: "Language", proficiency: 6, years: 1, color: "bg-red-500" },
        { name: "Spanish", category: "Language", proficiency: 5, years: 2, color: "bg-yellow-600" },
        { name: "Cross-cultural", category: "Global", proficiency: 9, years: 3, color: "bg-purple-600", projects: ["AIESEC Volunteer"] }
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

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const getOrbitRadius = (index: number, total: number) => {
    const baseRadius = 120;
    const radiusIncrement = 40;
    const orbit = Math.floor(index / 6);
    return baseRadius + (orbit * radiusIncrement);
  };

  const getSkillPosition = (index: number, total: number, categoryIndex: number) => {
    const orbit = Math.floor(index / 6);
    const positionInOrbit = index % 6;
    const angleStep = 360 / Math.min(6, total - (orbit * 6));
    const angle = (positionInOrbit * angleStep + categoryIndex * 15) * (Math.PI / 180);
    const radius = getOrbitRadius(index, total);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
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
          className="text-center mb-16 px-4"
          variants={categoryVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Skills Constellation
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Each skill orbits in its own galaxy, with proficiency determining distance from center. 
            Explore the interconnected universe of technologies and languages.
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={categoryVariants}
        >
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-white/20 border-white/40 text-white'
                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Skills
          </motion.button>
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.gradient} border-white/40 text-white`
                    : `bg-white/5 border-white/20 ${category.color} hover:bg-white/10`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden sm:inline">{category.name}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Enhanced Skills Constellation Display */}
        <div className="relative">
          {skillCategories.map((category, categoryIndex) => {
            if (selectedCategory && selectedCategory !== category.name) return null;
            
            return (
              <motion.div
                key={category.name}
                className="relative mb-20"
                variants={categoryVariants}
              >
                {/* Enhanced Category Header */}
                {!selectedCategory && (
                  <div className="text-center mb-12">
                    <motion.div 
                      className="inline-flex items-center space-x-3 mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className={`text-3xl font-bold ${category.color}`}>
                        {category.name}
                      </h3>
                    </motion.div>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
                  </div>
                )}

                {/* Professional Constellation Container */}
                <div className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden">
                  
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}></div>
                  </div>

                  {/* Central Hub with Professional Design */}
                  <motion.div
                    className="absolute w-20 h-20 rounded-full border-2 border-white/30 backdrop-blur-md bg-white/10 flex items-center justify-center z-10"
                    animate={{
                      boxShadow: [
                        `0 0 20px ${category.color.replace('text-', 'rgba(').replace('-400', '')}1, 0.3)`,
                        `0 0 40px ${category.color.replace('text-', 'rgba(').replace('-400', '')}1, 0.5)`,
                        `0 0 20px ${category.color.replace('text-', 'rgba(').replace('-400', '')}1, 0.3)`
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <category.icon className={`w-8 h-8 ${category.color}`} />
                  </motion.div>
                  
                  {/* Professional Orbital Rings */}
                  {[0, 1, 2, 3].map((orbit) => (
                    <motion.div
                      key={orbit}
                      className="absolute border border-white/20 rounded-full"
                      style={{
                        width: `${(80 + orbit * 60)}px`,
                        height: `${(80 + orbit * 60)}px`,
                        borderStyle: orbit % 2 === 0 ? 'solid' : 'dashed',
                      }}
                      animate={{ rotate: orbit % 2 === 0 ? 360 : -360 }}
                      transition={{
                        duration: 60 + orbit * 30,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}

                  {/* Enhanced Skills as Professional Nodes */}
                  {category.skills.map((skill, index) => {
                    const angle = (index * (360 / category.skills.length)) * (Math.PI / 180);
                    const orbit = Math.floor(skill.proficiency / 3); // 0-3 orbits based on proficiency
                    const radius = 80 + orbit * 60;
                    
                    const position = {
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                    };
                    
                    return (
                      <motion.div
                        key={skill.name}
                        className="absolute cursor-pointer group z-20"
                        style={{
                          left: `calc(50% + ${position.x}px)`,
                          top: `calc(50% + ${position.y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        onHoverStart={() => setHoveredSkill(skill.name)}
                        onHoverEnd={() => setHoveredSkill(null)}
                        whileHover={{ scale: 1.3, zIndex: 30 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        {/* Professional Skill Node */}
                        <motion.div
                          className={`relative w-12 h-12 rounded-xl ${skill.color} border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          style={{
                            background: `linear-gradient(135deg, ${skill.color.replace('bg-', '')} 0%, ${skill.color.replace('bg-', '').replace('-500', '-700')} 100%)`,
                          }}
                        >
                          {/* Skill Initial */}
                          <span className="text-white font-bold text-sm">
                            {skill.name.charAt(0)}
                          </span>
                          
                          {/* Proficiency Indicator */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 border border-white/30 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{skill.proficiency}</span>
                          </div>
                          
                          {/* Experience Badge */}
                          <div className="absolute -bottom-1 -left-1 px-1 py-0.5 bg-black/80 rounded text-xs text-white border border-white/20">
                            {skill.years}y
                          </div>
                        </motion.div>

                        {/* Enhanced Skill Tooltip */}
                        <AnimatePresence>
                          {hoveredSkill === skill.name && (
                            <motion.div
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-40"
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="bg-gray-900/95 text-white p-4 rounded-xl border border-white/20 backdrop-blur-md shadow-2xl min-w-max max-w-xs">
                                <div className="font-bold text-lg mb-2">{skill.name}</div>
                                
                                {/* Proficiency Bar */}
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                                    <span>Proficiency</span>
                                    <span>{skill.proficiency}/10</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${skill.proficiency * 10}%` }}
                                      transition={{ duration: 0.8, delay: 0.2 }}
                                    />
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-300 mb-2">
                                  <strong>{skill.years}</strong> year{skill.years !== 1 ? 's' : ''} experience
                                </div>
                                
                                {skill.projects && skill.projects.length > 0 && (
                                  <div className="text-sm">
                                    <div className="text-cyan-300 font-medium mb-1">Projects:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {skill.projects.map((project, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs border border-cyan-400/30">
                                          {project}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {skill.certifications && skill.certifications.length > 0 && (
                                  <div className="text-sm mt-2">
                                    <div className="flex items-center text-yellow-300 font-medium mb-1">
                                      <Award className="w-3 h-3 mr-1" />
                                      Certified
                                    </div>
                                    <div className="text-yellow-200 text-xs">
                                      {skill.certifications.join(', ')}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Tooltip Arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* Professional Connection Network */}
                  <svg className="absolute inset-0 pointer-events-none z-10">
                    {category.skills.map((skill, index) => {
                      if (!skill.projects) return null;
                      
                      return category.skills.map((otherSkill, otherIndex) => {
                        if (index >= otherIndex || !otherSkill.projects) return null;
                        
                        const sharedProjects = skill.projects?.filter(p => 
                          otherSkill.projects?.includes(p)
                        );
                        
                        if (!sharedProjects?.length) return null;
                        
                        const angle1 = (index * (360 / category.skills.length)) * (Math.PI / 180);
                        const orbit1 = Math.floor(skill.proficiency / 3);
                        const radius1 = 80 + orbit1 * 60;
                        const pos1 = {
                          x: Math.cos(angle1) * radius1,
                          y: Math.sin(angle1) * radius1,
                        };

                        const angle2 = (otherIndex * (360 / category.skills.length)) * (Math.PI / 180);
                        const orbit2 = Math.floor(otherSkill.proficiency / 3);
                        const radius2 = 80 + orbit2 * 60;
                        const pos2 = {
                          x: Math.cos(angle2) * radius2,
                          y: Math.sin(angle2) * radius2,
                        };
                        
                        return (
                          <motion.line
                            key={`${index}-${otherIndex}`}
                            x1={`calc(50% + ${pos1.x}px)`}
                            y1={`calc(50% + ${pos1.y}px)`}
                            x2={`calc(50% + ${pos2.x}px)`}
                            y2={`calc(50% + ${pos2.y}px)`}
                            stroke="rgba(99, 102, 241, 0.3)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 2, delay: index * 0.1 }}
                          />
                        );
                      });
                    })}
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Professional Legend */}
        <motion.div
          className="mt-12 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm"
          variants={categoryVariants}
        >
          <h4 className="text-lg font-semibold text-white mb-4 text-center">How to Read the Constellation</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xs border border-white/30">
                R
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white">Skill Node</div>
                <div>Letter = Skill initial</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">9</span>
                </div>
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white">Proficiency Level</div>
                <div>1-10 scale rating</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-6 border border-white/30 rounded-full"></div>
                <div className="w-2 h-6 border border-white/30 rounded-full"></div>
                <div className="w-2 h-6 border border-white/30 rounded-full"></div>
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white">Orbit Rings</div>
                <div>Grouped by proficiency</div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center text-gray-400">
            <p>Dashed lines connect skills used in shared projects • Hover any skill for detailed information</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};