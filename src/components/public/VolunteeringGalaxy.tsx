import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Target, ArrowRight, Globe, 
  Heart, Star, CheckCircle, Clock, Languages, Award,
  GraduationCap, Briefcase, Lightbulb
} from 'lucide-react';

interface Experience {
  id: string;
  country: string;
  flag: string;
  role: string;
  description: string;
  impact: string;
  stats: string;
  projects: string[];
  status: 'completed' | 'upcoming';
  year: string;
}

interface Language {
  name: string;
  level: string;
  flag: string;
  proficiency: number;
}

export const VolunteeringGalaxy: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    // Load experiences from JSON
    fetch('/data/experiences.json')
      .then(res => res.json())
      .then(data => {
        setExperiences(data.experiences);
      })
      .catch(() => {
        // Fallback data
        const fallbackExperiences: Experience[] = [
          {
            id: "tunisia",
            country: "Tunisia",
            flag: "🇹🇳",
            role: "Home Base • Student Solutions",
            description: "Building solutions for real challenges faced by Tunisian students: professor availability, housing, and academic communication.",
            impact: "Growing up here taught me that the best technology solves everyday frustrations. DocConnect exists because I've waited outside professors' offices myself.",
            stats: "200+ students served",
            projects: ["docconnect", "student-housing"],
            status: "completed",
            year: "2018-2024"
          },
          {
            id: "turkey",
            country: "Turkey",
            flag: "🇹🇷",
            role: "AIESEC Volunteer • English Teacher",
            description: "Taught English to 40+ students using creative methods and basic AI tools. Connected across language and cultural barriers.",
            impact: "Discovered that technology amplifies human connection—it doesn't replace it. The best AI tools make teachers more effective, not obsolete.",
            stats: "40+ students taught",
            projects: [],
            status: "completed",
            year: "2023"
          },
          {
            id: "morocco",
            country: "Morocco",
            flag: "🇲🇦",
            role: "AIESEC Volunteer • Skills Trainer",
            description: "Facilitated soft skills workshops focusing on communication and leadership. Experienced cultural exchange acceleration.",
            impact: "Learned that the best solutions emerge when different perspectives meet. This experience shapes how I approach every AI project.",
            stats: "Multiple workshops delivered",
            projects: [],
            status: "completed",
            year: "2023"
          },
          {
            id: "india",
            country: "India",
            flag: "🇮🇳",
            role: "Upcoming • AI in Healthcare",
            description: "Preparing to work on AI-powered healthcare solutions that improve access and outcomes in resource-constrained environments.",
            impact: "Ready to apply global perspective and technical skills to healthcare challenges at scale. AI with purpose, impact, and cultural awareness.",
            stats: "Planning phase",
            projects: [],
            status: "upcoming",
            year: "2024"
          }
        ];
        setExperiences(fallbackExperiences);
      });
  }, []);

  const languages: Language[] = [
    { name: "Arabic", level: "Native", flag: "🇹🇳", proficiency: 100 },
    { name: "French", level: "Fluent", flag: "🇫🇷", proficiency: 95 },
    { name: "English", level: "Fluent", flag: "🇺🇸", proficiency: 90 },
    { name: "German", level: "Intermediate", flag: "🇩🇪", proficiency: 60 },
    { name: "Turkish", level: "Basic", flag: "🇹🇷", proficiency: 40 }
  ];

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? CheckCircle : Clock;
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'text-emerald-400' : 'text-orange-400';
  };

  const getCountryTheme = (country: string) => {
    switch (country.toLowerCase()) {
      case 'tunisia':
        return {
          gradient: 'from-red-500 to-green-500',
          bg: 'bg-red-900/20',
          border: 'border-red-400/30',
          color: 'text-red-400'
        };
      case 'turkey':
        return {
          gradient: 'from-red-600 to-red-700',
          bg: 'bg-red-900/20',
          border: 'border-red-400/30',
          color: 'text-red-400'
        };
      case 'morocco':
        return {
          gradient: 'from-green-600 to-red-600',
          bg: 'bg-green-900/20',
          border: 'border-green-400/30',
          color: 'text-green-400'
        };
      case 'india':
        return {
          gradient: 'from-orange-500 to-green-500',
          bg: 'bg-orange-900/20',
          border: 'border-orange-400/30',
          color: 'text-orange-400'
        };
      default:
        return {
          gradient: 'from-emerald-500 to-teal-500',
          bg: 'bg-emerald-900/20',
          border: 'border-emerald-400/30',
          color: 'text-emerald-400'
        };
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

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
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Global Impact
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From Tunisia to Turkey, Morocco to India—each destination shaped my understanding 
            of how technology can bridge cultures and serve humanity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Experience Cards */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={itemVariants}
          >
            {experiences.map((exp, index) => {
              const StatusIcon = getStatusIcon(exp.status);
              const theme = getCountryTheme(exp.country);
              const isSelected = selectedExperience === exp.id;
              
              return (
                <motion.div
                  key={exp.id}
                  className={`relative p-6 rounded-2xl backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                    isSelected 
                      ? `${theme.border} ring-2 ring-emerald-400/30 bg-white/10 border` 
                      : 'border-white/10 hover:border-white/20 bg-white/5 border'
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedExperience(isSelected ? null : exp.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{exp.flag}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{exp.country}</h3>
                        <p className="text-emerald-300 text-sm">{exp.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(exp.status)}`} />
                        <span className={`text-sm capitalize ${getStatusColor(exp.status)}`}>
                          {exp.status}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isSelected ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold">{exp.role}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{exp.stats}</span>
                    </div>
                    {exp.projects && exp.projects.length > 0 && (
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{exp.projects.length} project{exp.projects.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Expand hint */}
                  <div className="text-xs text-gray-400">
                    Click to {isSelected ? 'collapse' : 'explore deeper'}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-white/10"
                      >
                        <div className="space-y-6">
                          {/* Cultural Impact */}
                          <div>
                            <div className="flex items-center space-x-2 text-cyan-400 mb-3">
                              <Heart className="w-5 h-5" />
                              <span className="font-semibold">Cultural Impact & Learning</span>
                            </div>
                            <div className={`p-4 rounded-xl ${theme.bg} ${theme.border} border backdrop-blur-sm`}>
                              <p className="text-gray-300 leading-relaxed">
                                {exp.impact}
                              </p>
                            </div>
                          </div>

                          {/* Projects */}
                          {exp.projects && exp.projects.length > 0 && (
                            <div>
                              <div className="flex items-center space-x-2 text-purple-400 mb-3">
                                <Star className="w-5 h-5" />
                                <span className="font-semibold">Related Projects</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {exp.projects.map((project, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-400/30"
                                  >
                                    {project}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Insight */}
                          <div>
                            <div className="flex items-center space-x-2 text-yellow-400 mb-3">
                              <Lightbulb className="w-5 h-5" />
                              <span className="font-semibold">Key Insight for AI Development</span>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-xl p-4">
                              <p className="text-yellow-200 italic leading-relaxed">
                                {exp.status === 'completed' 
                                  ? `This experience taught me that ${exp.country.toLowerCase() === 'tunisia' 
                                      ? 'the best AI solutions emerge from understanding local frustrations and daily challenges.'
                                      : exp.country.toLowerCase() === 'turkey'
                                      ? 'effective AI tools enhance human teaching abilities rather than replacing human connection.'
                                      : exp.country.toLowerCase() === 'morocco'
                                      ? 'diverse cultural perspectives lead to more innovative and inclusive AI solutions.'
                                      : 'global AI applications must respect local wisdom and cultural approaches to problem-solving.'}`
                                  : 'This upcoming experience will demonstrate how AI can democratize healthcare access while respecting cultural approaches to wellness and healing.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Sidebar - Languages & Stats */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Languages Spoken */}
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
                Global Impact Summary
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-1">4</div>
                  <div className="text-gray-300 text-sm">Countries Experienced</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">250+</div>
                  <div className="text-gray-300 text-sm">Lives Directly Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">5</div>
                  <div className="text-gray-300 text-sm">Languages Spoken</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">∞</div>
                  <div className="text-gray-300 text-sm">Cultural Bridges Built</div>
                </div>
              </div>
            </div>

            {/* Philosophy Card */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-400" />
                Global AI Philosophy
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Technology becomes meaningful when it serves humanity across cultures. 
                My global experiences shape every AI solution I build—ensuring empathy, 
                cultural sensitivity, and real-world impact."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interaction Hint */}
        <motion.div
          className="text-center mt-12 text-gray-400 text-sm"
          variants={itemVariants}
        >
          <p>Click experience cards to explore cultural insights and impact stories</p>
        </motion.div>
      </motion.div>
    </div>
  );
};