import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Heart } from 'lucide-react';

export const IdentityCard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Animated Avatar */}
        <motion.div
          className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48"
          variants={itemVariants}
        >
          <motion.div
            className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 p-1 shadow-2xl shadow-purple-400/30"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
              {/* Profile Photo */}
              <img 
                src="/photo.jpg" 
                alt="Selma Bettaieb" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          {/* Floating Icons */}
          <motion.div
            className="absolute -bottom-4 -left-4"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Code className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight px-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Selma
            </span>
            <br />
            <span className="text-white">
              Bettaieb
            </span>
          </h1>
          
          <motion.div
            className="text-lg sm:text-xl md:text-2xl text-gray-300 space-y-2 px-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <span>AI Engineer</span>
              </div>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                <span>Global Volunteer</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          variants={itemVariants}
          className="max-w-3xl mx-auto space-y-6 px-4"
        >
          <div className="relative p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed"
              variants={itemVariants}
            >
              "I build AI that solves real problems for real people. From teaching English in Turkey to preparing 
              for healthcare AI work in India—
              <span className="text-cyan-400 font-semibold"> technology becomes meaningful when it serves humanity</span>."
            </motion.p>
            
            {/* Decorative Elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full opacity-60" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full opacity-60" />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};