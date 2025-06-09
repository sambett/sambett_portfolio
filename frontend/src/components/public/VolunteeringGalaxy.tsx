import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Globe } from 'lucide-react';

interface Experience {
  id: string;
  country: string;
  flag: string;
  role: string;
  description: string;
  impact: string;
  stats: string;
  year: string;
  status: 'completed' | 'upcoming';
}

export const VolunteeringGalaxy: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    // Load experiences from JSON
    fetch('/data/experiences.json')
      .then(res => res.json())
      .then(data => setExperiences(data.experiences))
      .catch(() => {
        // Fallback data
        setExperiences([
          {
            id: "tunisia",
            country: "Tunisia",
            flag: "🇹🇳",
            role: "Home Base • Student Solutions",
            description: "Building solutions for real challenges faced by Tunisian students: professor availability, housing, and academic communication.",
            impact: "Growing up here taught me that the best technology solves everyday frustrations. DocConnect exists because I've waited outside professors' offices myself.",
            stats: "200+ students served",
            year: "2018-2024",
            status: "completed"
          }
        ]);
      });
  }, []);

  const getCountryPosition = (country: string) => {
    const positions = {
      'Tunisia': { x: '52%', y: '35%' },
      'Turkey': { x: '58%', y: '28%' },
      'Morocco': { x: '48%', y: '38%' },
      'India': { x: '75%', y: '45%' }
    };
    return positions[country as keyof typeof positions] || { x: '50%', y: '50%' };
  };

  const getCountryTheme = (country: string) => {
    const themes = {
      'Tunisia': 'from-red-500 to-red-600',
      'Turkey': 'from-red-600 to-white',
      'Morocco': 'from-red-500 to-green-600',
      'India': 'from-orange-500 to-green-600'
    };
    return themes[country as keyof typeof themes] || 'from-blue-500 to-purple-600';
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
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
          variants={itemVariants}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Global Impact Galaxy
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From Tunisia to Turkey, Morocco to India—each country taught me that 
            technology becomes powerful when it serves real human needs across cultures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive World Map */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
              {/* World Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20" />
              
              {/* Continents (simplified shapes) */}
              <div className="absolute inset-0">
                {/* Africa */}
                <div className="absolute" style={{ left: '45%', top: '40%', width: '15%', height: '25%' }}>
                  <div className="w-full h-full bg-green-600/30 rounded-tl-3xl rounded-br-3xl transform rotate-12" />
                </div>
                
                {/* Europe */}
                <div className="absolute" style={{ left: '50%', top: '25%', width: '12%', height: '15%' }}>
                  <div className="w-full h-full bg-blue-600/30 rounded-lg" />
                </div>
                
                {/* Asia */}
                <div className="absolute" style={{ left: '65%', top: '30%', width: '25%', height: '30%' }}>
                  <div className="w-full h-full bg-purple-600/30 rounded-xl transform -rotate-6" />
                </div>
              </div>

              {/* Country Markers */}
              {experiences.map((exp, index) => {
                const position = getCountryPosition(exp.country);
                const isHovered = hoveredCountry === exp.country;
                
                return (
                  <motion.div
                    key={exp.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: position.x, top: position.y }}
                    onMouseEnter={() => setHoveredCountry(exp.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => setSelectedExperience(exp)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Pulsing Ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${
                        exp.status === 'upcoming' ? 'border-yellow-400' : 'border-green-400'
                      }`}
                      animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
                      transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                    />
                    
                    {/* Country Marker */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCountryTheme(exp.country)} 
                      flex items-center justify-center text-2xl border-2 border-white/20 shadow-lg backdrop-blur-sm`}>
                      {exp.flag}
                    </div>
                    
                    {/* Country Label */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                        {exp.country}
                      </div>
                    </div>

                    {/* Connection Lines */}
                    {index > 0 && (
                      <svg className="absolute inset-0 pointer-events-none" style={{ width: '400px', height: '300px', left: '-200px', top: '-150px' }}>
                        <motion.path
                          d={`M 200 150 Q ${200 + (index * 50)} ${150 - (index * 30)} ${200 + (index * 100)} ${150 + (index * 20)}`}
                          stroke="rgba(34, 197, 94, 0.3)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: index * 0.5 }}
                        />
                      </svg>
                    )}
                  </motion.div>
                );
              })}

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400 rounded-full opacity-60"
                    animate={{
                      x: [0, Math.random() * 400],
                      y: [0, Math.random() * 300],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${
                  exp.status === 'upcoming' 
                    ? 'from-yellow-900/20 to-orange-900/20 border-yellow-400/30' 
                    : 'from-green-900/20 to-emerald-900/20 border-green-400/30'
                } border backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform duration-300`}
                onClick={() => setSelectedExperience(exp)}
                whileHover={{ y: -5 }}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{exp.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.country}</h3>
                      <p className={`text-sm ${exp.status === 'upcoming' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {exp.year}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    exp.status === 'upcoming' 
                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                      : 'bg-green-400/20 text-green-400 border border-green-400/30'
                  }`}>
                    {exp.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </div>
                </div>

                {/* Role */}
                <h4 className="text-lg font-semibold text-white mb-2">{exp.role}</h4>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{exp.stats}</span>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-gray-300 text-sm line-clamp-2">
                  {exp.description}
                </p>

                {/* Hover Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-gray-400">Click to read more</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Detail Modal */}
        <AnimatePresence>
          {selectedExperience && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedExperience(null)}
              />

              {/* Modal Content */}
              <motion.div
                className="relative max-w-4xl w-full bg-gray-900/95 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-6xl">{selectedExperience.flag}</span>
                    <div>
                      <h3 className="text-4xl font-bold text-white">{selectedExperience.country}</h3>
                      <p className="text-xl text-gray-300">{selectedExperience.role}</p>
                      <p className={`text-lg ${selectedExperience.status === 'upcoming' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedExperience.year}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-semibold text-white mb-3 flex items-center">
                      <Globe className="w-6 h-6 mr-2 text-green-400" />
                      Experience
                    </h4>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {selectedExperience.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-2xl font-semibold text-white mb-3 flex items-center">
                      <Heart className="w-6 h-6 mr-2 text-red-400" />
                      Impact & Learning
                    </h4>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {selectedExperience.impact}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-semibold text-white">Impact Metrics</span>
                    </div>
                    <p className="text-blue-400 text-xl font-bold">{selectedExperience.stats}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};