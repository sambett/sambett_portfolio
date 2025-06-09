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
          className="relative mx-auto w-48 h-48"
          variants={itemVariants}
        >
          <motion.div
            className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 p-1"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              {/* 3D-like Avatar Placeholder */}
              <div className="text-6xl font-bold bg-gradient-to-br from-purple-300 to-cyan-300 bg-clip-text text-transparent">
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
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Selma
            </span>
            <br />
            <span className="text-white">
              Bettaieb
            </span>
          </h1>
          
          <motion.div
            className="text-xl md:text-2xl text-gray-300 space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-4">
              <Globe className="w-6 h-6 text-green-400" />
              <span>AI Engineer</span>
              <span className="text-gray-500">•</span>
              <Heart className="w-6 h-6 text-red-400" />
              <span>Global Volunteer</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          variants={itemVariants}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <motion.p 
              className="text-lg md:text-xl text-gray-200 leading-relaxed"
              variants={itemVariants}
            >
              "I build AI that solves real problems for real people. From helping 200+ Tunisian students 
              access housing and professor availability, to teaching English in Turkey and preparing 
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

        {/* Scroll Hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-gray-400 text-sm">Scroll to explore my universe</div>
          <div className="w-6 h-10 mx-auto mt-2 border-2 border-gray-400 rounded-full">
            <motion.div
              className="w-1 h-2 bg-gray-400 rounded-full mx-auto mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};