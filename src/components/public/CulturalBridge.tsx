import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Target, ArrowRight, Globe, 
  Lightbulb, Heart, Star, CheckCircle, Clock, 
  GraduationCap, Code, Briefcase
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

interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keyLearning: string;
  icon: React.ComponentType<any>;
  color: string;
  position: number;
}

export const CulturalBridge: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  const journeySteps: JourneyStep[] = [
    {
      id: "foundation",
      title: "Cultural Foundation",
      subtitle: "Growing up with diverse perspectives",
      description: "Born into a multicultural environment where different approaches to problem-solving coexist",
      keyLearning: "Technology should serve human needs, not impose uniform solutions",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      position: 0
    },
    {
      id: "education",
      title: "Technical Education",
      subtitle: "Building AI & engineering skills",
      description: "Mastering technical foundations while maintaining focus on human-centered design",
      keyLearning: "The best engineers understand both code and context",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      position: 25
    },
    {
      id: "exploration",
      title: "Global Exchange",
      subtitle: "Teaching & learning across cultures",
      description: "Volunteering in Turkey and Morocco, discovering universal human needs through local experiences",
      keyLearning: "Empathy scales better than algorithms",
      icon: Globe,
      color: "from-emerald-500 to-teal-500",
      position: 50
    },
    {
      id: "application",
      title: "AI with Purpose",
      subtitle: "Building solutions that matter",
      description: "Creating technology that addresses real problems for real people in their cultural context",
      keyLearning: "The most impactful AI solves problems you've personally experienced",
      icon: Code,
      color: "from-purple-500 to-indigo-500",
      position: 75
    },
    {
      id: "future",
      title: "Healthcare Impact",
      subtitle: "Scaling empathy through technology",
      description: "Applying cross-cultural insights to healthcare AI that respects diverse approaches to wellness",
      keyLearning: "AI should amplify human wisdom, not replace human judgment",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
      position: 100
    }
  ];

  // Auto-play through journey steps
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveJourneyStep((prev) => (prev + 1) % journeySteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, journeySteps.length]);

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? CheckCircle : Clock;
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'text-emerald-400' : 'text-orange-400';
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
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Cultural Journey
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            How global experiences shape AI solutions that respect cultural diversity
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          className="mb-16"
          variants={itemVariants}
        >
          <div className="relative">
            {/* Timeline Background */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full opacity-30" />
            
            {/* Auto-play Controls */}
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                  isAutoPlaying 
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400' 
                    : 'bg-gray-500/20 border-gray-400/30 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAutoPlaying ? 'Pause Journey' : 'Play Journey'}
              </motion.button>
            </div>

            {/* Journey Steps */}
            <div className="space-y-12">
              {journeySteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeJourneyStep === index;
                
                return (
                  <motion.div
                    key={step.id}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {/* Timeline Node */}
                    <motion.div
                      className="absolute left-1/2 transform -translate-x-1/2 z-10"
                      animate={{
                        scale: isActive ? 1.3 : 1,
                        boxShadow: isActive 
                          ? '0 0 20px rgba(16, 185, 129, 0.6)' 
                          : '0 0 0px rgba(16, 185, 129, 0)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center border-4 border-gray-900`}>
                        <StepIcon className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>

                    {/* Step Content */}
                    <motion.div
                      className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        opacity: isActive ? 1 : 0.7
                      }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setActiveJourneyStep(index)}
                    >
                      <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-all duration-300 ${
                        isActive ? 'ring-2 ring-emerald-400/50' : ''
                      }`}>
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-emerald-300 text-sm mb-3">{step.subtitle}</p>
                        <p className="text-gray-300 mb-4 leading-relaxed">{step.description}</p>
                        
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                          <p className="text-yellow-300 text-sm italic">{step.keyLearning}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Experience Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          variants={itemVariants}
        >
          {experiences.map((exp, index) => {
            const StatusIcon = getStatusIcon(exp.status);
            const isSelected = selectedExperience === exp.id;
            
            return (
              <motion.div
                key={exp.id}
                className={`relative p-6 rounded-2xl bg-white/5 border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                  isSelected 
                    ? 'border-cyan-400/50 ring-2 ring-cyan-400/30 bg-white/10' 
                    : 'border-white/10 hover:border-white/20'
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
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{exp.flag}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.country}</h3>
                      <p className="text-cyan-300 text-sm">{exp.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(exp.status)}`} />
                    <span className={`text-sm capitalize ${getStatusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  </div>
                </div>

                {/* Role */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-semibold text-sm">{exp.role}</span>
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
                  {exp.projects.length > 0 && (
                    <div className="flex items-center space-x-2 text-purple-400">
                      <Code className="w-4 h-4" />
                      <span className="text-sm">{exp.projects.length} project{exp.projects.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Expand Indicator */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Click to {isSelected ? 'collapse' : 'learn more'}
                  </div>
                  <motion.div
                    animate={{ rotate: isSelected ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
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
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                            <Heart className="w-4 h-4" />
                            <span className="font-semibold text-sm">Cultural Impact</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-3 rounded-lg">
                            {exp.impact}
                          </p>
                        </div>

                        {exp.projects.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 text-purple-400 mb-2">
                              <Star className="w-4 h-4" />
                              <span className="font-semibold text-sm">Related Projects</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {exp.projects.map((project, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30"
                                >
                                  {project}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Philosophy Statement */}
        <motion.div
          className="text-center bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10"
          variants={itemVariants}
        >
          <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Global Perspective, Local Impact</h3>
          <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto text-lg">
            Every culture I've experienced has taught me that the best technology emerges when we combine 
            diverse perspectives with deep empathy. My AI solutions don't just work globally—they respect 
            and enhance the unique ways different communities solve problems.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">4</div>
              <div className="text-gray-300">Countries Experienced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">200+</div>
              <div className="text-gray-300">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
              <div className="text-gray-300">Perspectives Gained</div>
            </div>
          </div>
        </motion.div>

        {/* Interaction Hint */}
        <motion.div
          className="text-center mt-8 text-gray-400 text-sm"
          variants={itemVariants}
        >
          <p>Click experience cards to dive deeper • Journey auto-plays or click to navigate</p>
        </motion.div>
      </motion.div>
    </div>
  );
};