import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Code, Heart } from 'lucide-react';

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
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-white/10">
              {/* Centered Avatar Initials */}
              <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                SB
              </div>
            </div>
          </motion.div>
          
          {/* Floating Icons */}
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
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

        {/* Key Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {[
            { number: "3", label: "Countries Volunteered", icon: Globe, color: "text-green-400" },
            { number: "200+", label: "Students Served", icon: Heart, color: "text-red-400" },
            { number: "6+", label: "AI Projects Built", icon: Code, color: "text-cyan-400" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center space-y-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <stat.icon className={`w-8 h-8 mx-auto ${stat.color}`} />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                  style={{
                    background: `radial-gradient(circle, ${stat.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' : 
                      stat.color.includes('red') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'} 0%, transparent 70%)`,
                  }}
                />
              </div>
              <div className="text-3xl font-bold text-white">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Badge - Moved from mission statement */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2">
            <div className="text-purple-300 text-sm font-medium flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>200+ student lives impacted</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Scroll Hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-gray-400 text-xs mb-2 opacity-75">scroll to explore</div>
          <div className="w-6 h-10 mx-auto border-2 border-gray-400/60 rounded-full relative overflow-hidden">
            <motion.div
              className="w-1 h-2 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full mx-auto mt-2 absolute left-1/2 transform -translate-x-1/2"
              animate={{ y: [8, 20, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};