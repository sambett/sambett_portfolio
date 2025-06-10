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

        {/* Skills Constellation Display */}
        <div className="relative">
          {skillCategories.map((category, categoryIndex) => {
            if (selectedCategory && selectedCategory !== category.name) return null;
            
            return (
              <motion.div
                key={category.name}
                className="relative mb-16"
                variants={categoryVariants}
              >
                {/* Category Title */}
                {!selectedCategory && (
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold ${category.color}`}>
                      {category.name}
                    </h3>
                  </div>
                )}

                {/* Constellation Container */}
                <div className="relative h-96 flex items-center justify-center">
                  {/* Center Hub */}
                  <motion.div
                    className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} blur-sm opacity-60`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Orbital Rings */}
                  {[0, 1, 2].map((orbit) => (
                    <motion.div
                      key={orbit}
                      className="absolute border border-white/10 rounded-full"
                      style={{
                        width: `${(getOrbitRadius(orbit * 6, category.skills.length) * 2)}px`,
                        height: `${(getOrbitRadius(orbit * 6, category.skills.length) * 2)}px`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 30 + orbit * 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}

                  {/* Skills as Orbiting Planets */}
                  {category.skills.map((skill, index) => {
                    const position = getSkillPosition(index, category.skills.length, categoryIndex);
                    const size = Math.max(8, skill.proficiency * 2);
                    
                    return (
                      <motion.div
                        key={skill.name}
                        className="absolute cursor-pointer group"
                        style={{
                          left: `calc(50% + ${position.x}px)`,
                          top: `calc(50% + ${position.y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 20 + index * 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        onHoverStart={() => setHoveredSkill(skill.name)}
                        onHoverEnd={() => setHoveredSkill(null)}
                        whileHover={{ scale: 1.5 }}
                      >
                        {/* Skill Planet */}
                        <motion.div
                          className={`w-${Math.floor(size/4)*4} h-${Math.floor(size/4)*4} rounded-full ${skill.color} relative overflow-hidden`}
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            boxShadow: `0 0 ${size}px ${skill.color.replace('bg-', 'rgba(')}-500, 0.3)`,
                          }}
                        >
                          {/* Proficiency Ring */}
                          <div
                            className="absolute inset-0 rounded-full border-2 border-white/30"
                            style={{
                              borderWidth: `${skill.proficiency / 5}px`,
                            }}
                          />
                        </motion.div>

                        {/* Skill Tooltip */}
                        <AnimatePresence>
                          {hoveredSkill === skill.name && (
                            <motion.div
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="bg-black/90 text-white p-3 rounded-lg border border-white/20 backdrop-blur-sm min-w-max">
                                <div className="font-bold text-sm">{skill.name}</div>
                                <div className="text-xs text-gray-300 mt-1">
                                  {skill.years} year{skill.years !== 1 ? 's' : ''} • {skill.proficiency}/10 proficiency
                                </div>
                                {skill.projects && (
                                  <div className="text-xs text-cyan-300 mt-1">
                                    Projects: {skill.projects.join(', ')}
                                  </div>
                                )}
                                {skill.certifications && (
                                  <div className="text-xs text-yellow-300 mt-1">
                                    <Award className="w-3 h-3 inline mr-1" />
                                    {skill.certifications.join(', ')}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* Connecting Lines for Related Skills */}
                  <svg className="absolute inset-0 pointer-events-none">
                    {category.skills.map((skill, index) => {
                      if (!skill.projects) return null;
                      
                      return category.skills.map((otherSkill, otherIndex) => {
                        if (index >= otherIndex || !otherSkill.projects) return null;
                        
                        const sharedProjects = skill.projects?.filter(p => 
                          otherSkill.projects?.includes(p)
                        );
                        
                        if (!sharedProjects?.length) return null;
                        
                        const pos1 = getSkillPosition(index, category.skills.length, categoryIndex);
                        const pos2 = getSkillPosition(otherIndex, category.skills.length, categoryIndex);
                        
                        return (
                          <motion.line
                            key={`${index}-${otherIndex}`}
                            x1={`calc(50% + ${pos1.x}px)`}
                            y1={`calc(50% + ${pos1.y}px)`}
                            x2={`calc(50% + ${pos2.x}px)`}
                            y2={`calc(50% + ${pos2.y}px)`}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
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

        {/* Legend */}
        <motion.div
          className="text-center text-sm text-gray-400 mt-8"
          variants={categoryVariants}
        >
          <p>Planet size represents proficiency level • Ring thickness shows experience depth • Lines connect skills used in shared projects</p>
        </motion.div>
      </motion.div>
    </div>
  );
};