import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Heart, Globe, Languages } from 'lucide-react';

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

interface Language {
  name: string;
  level: string;
  flag: string;
  proficiency: number;
}

export const VolunteeringGalaxy: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const experiences: Experience[] = [
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
    },
    {
      id: "turkey",
      country: "Turkey",
      flag: "🇹🇷",
      role: "English Teaching • AIESEC",
      description: "Teaching English to local students while experiencing Turkish culture and building cross-cultural bridges.",
      impact: "Learned that technology means nothing without human connection. Teaching abroad showed me the universal language of learning.",
      stats: "50+ students taught",
      year: "2023",
      status: "completed"
    },
    {
      id: "morocco",
      country: "Morocco",
      flag: "🇲🇦",
      role: "Cultural Exchange • Community Work",
      description: "Participated in community development projects while immersing in Moroccan culture and Amazigh traditions.",
      impact: "Discovered how ancient wisdom and modern technology can complement each other for sustainable development.",
      stats: "3 communities impacted",
      year: "2023",
      status: "completed"
    },
    {
      id: "india",
      country: "India",
      flag: "🇮🇳",
      role: "Healthcare AI • Future Mission",
      description: "Preparing for healthcare AI deployment in rural areas, focusing on diagnostic assistance and medical access.",
      impact: "Will bring AI solutions to underserved communities, proving technology's power to democratize healthcare.",
      stats: "Planning phase",
      year: "2025",
      status: "upcoming"
    }
  ];

  const languages: Language[] = [
    { name: "Arabic", level: "Native", flag: "🇹🇳", proficiency: 100 },
    { name: "French", level: "Fluent", flag: "🇫🇷", proficiency: 95 },
    { name: "English", level: "Fluent", flag: "🇺🇸", proficiency: 90 },
    { name: "German", level: "Intermediate", flag: "🇩🇪", proficiency: 60 },
    { name: "Turkish", level: "Basic", flag: "🇹🇷", proficiency: 40 }
  ];

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
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
          className="text-center mb-12 sm:mb-16 px-4"
          variants={itemVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Global Journey
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From Tunisia to Turkey, Morocco to India—each destination shaped my understanding 
            of how technology can bridge cultures and serve humanity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Journey Timeline with Walking Avatar */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-emerald-400 to-teal-400"></div>
              
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative flex items-start space-x-6 pb-8"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedExperience(exp)}
                >
                  {/* Walking Avatar */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                        exp.status === 'upcoming' 
                          ? 'from-yellow-400 to-orange-500' 
                          : 'from-green-400 to-emerald-500'
                      } flex items-center justify-center text-2xl border-4 border-white/20 shadow-lg z-10 relative cursor-pointer`}
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {exp.status === 'upcoming' ? '🚶‍♀️' : '🎯'}
                    </motion.div>
                    
                    {/* Pulsing Ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${
                        exp.status === 'upcoming' ? 'border-yellow-400' : 'border-green-400'
                      }`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </div>

                  {/* Experience Card */}
                  <motion.div
                    className={`flex-1 p-6 rounded-2xl bg-gradient-to-br ${
                      exp.status === 'upcoming'
                        ? 'from-yellow-900/20 to-orange-900/20 border-yellow-400/30'
                        : 'from-green-900/20 to-emerald-900/20 border-green-400/30'
                    } border backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300`}
                    whileHover={{ y: -5, shadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{exp.flag}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{exp.country}</h3>
                          <p className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
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

                    <h4 className="text-lg font-semibold text-white mb-3">{exp.role}</h4>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {exp.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{exp.stats}</span>
                      </div>
                      <div className="text-xs text-gray-500 hover:text-white transition-colors">
                        Click to read more →
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Languages Spoken */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Languages className="w-6 h-6 mr-3 text-purple-400" />
                Languages
              </h3>
              
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{lang.flag}</span>
                        <div>
                          <p className="text-white font-medium">{lang.name}</p>
                          <p className="text-sm text-gray-400">{lang.level}</p>
                        </div>
                      </div>
                      <div className="text-sm text-purple-400 font-medium">
                        {lang.proficiency}%
                      </div>
                    </div>
                    
                    {/* Proficiency Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.proficiency}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-teal-900/20 to-green-900/20 border border-teal-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-teal-400" />
                Global Impact
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Countries Visited</span>
                  <span className="text-2xl font-bold text-teal-400">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Lives Impacted</span>
                  <span className="text-2xl font-bold text-green-400">250+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cultural Bridges</span>
                  <span className="text-2xl font-bold text-emerald-400">∞</span>
                </div>
              </div>
            </div>
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
                className="relative max-w-4xl w-full bg-gray-900/95 rounded-3xl p-8 border border-white/10 backdrop-blur-sm mx-4"
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
                      <p className={`text-lg ${
                        selectedExperience.status === 'upcoming' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
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
                      <MapPin className="w-6 h-6 mr-2 text-green-400" />
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