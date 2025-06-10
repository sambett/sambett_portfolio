import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Code, Heart, Brain, Zap } from 'lucide-react';

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
      y: [-15, 15, -15],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Floating background shapes
  const FloatingShape = ({ 
    size, 
    color, 
    position, 
    delay = 0, 
    duration = 6 
  }: {
    size: string;
    color: string;
    position: string;
    delay?: number;
    duration?: number;
  }) => (
    <motion.div
      className={`absolute ${position} ${size} ${color} rounded-full opacity-20 blur-xl`}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingShape 
          size="w-32 h-32" 
          color="bg-purple-500" 
          position="top-20 left-20" 
          delay={0}
          duration={8}
        />
        <FloatingShape 
          size="w-24 h-24" 
          color="bg-cyan-500" 
          position="top-32 right-32" 
          delay={2}
          duration={10}
        />
        <FloatingShape 
          size="w-40 h-40" 
          color="bg-pink-500" 
          position="bottom-40 left-16" 
          delay={4}
          duration={12}
        />
        <FloatingShape 
          size="w-28 h-28" 
          color="bg-yellow-500" 
          position="bottom-20 right-20" 
          delay={1}
          duration={9}
        />

        {/* Geometric Grid Lines */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Enhanced Avatar Section */}
        <motion.div
          className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
          variants={itemVariants}
        >
          {/* Orbital Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-purple-400/30"
            style={{
              width: '140%',
              height: '140%',
              left: '-20%',
              top: '-20%',
            }}
            variants={orbitVariants}
            animate="animate"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
          </motion.div>

          {/* Main Avatar */}
          <motion.div
            className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 shadow-2xl shadow-purple-400/20"
            variants={floatingVariants}
            animate="animate"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-white/10">
              <img
                src="/profile.png"
                alt="Selma Bettaieb"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>
          
          {/* Floating Icons */}
          <motion.div
            className="absolute -top-3 -right-3 bg-black/40 backdrop-blur-sm rounded-full p-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [-5, 5, -5],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-4 h-4 text-yellow-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-3 -left-3 bg-black/40 backdrop-blur-sm rounded-full p-2"
            animate={{ 
              rotate: [0, -10, 10, 0],
              y: [5, -5, 5],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Refined Typography */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-wide px-4">
            <motion.span 
              className="block bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-extralight"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Selma
            </motion.span>
            <motion.span 
              className="block text-white font-light"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Bettaieb
            </motion.span>
          </h1>
          
          <motion.div
            className="text-base sm:text-lg lg:text-xl text-gray-300 space-y-3 px-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-6 flex-wrap gap-2">
              <motion.div 
                className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm">AI Engineer</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm">Global Volunteer</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Mission Statement */}
        <motion.div 
          variants={itemVariants}
          className="max-w-3xl mx-auto px-4"
        >
          <motion.div 
            className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-light"
              variants={itemVariants}
            >
              "I build AI that solves real problems for real people. From teaching English in Turkey to preparing 
              for healthcare AI work in India—{' '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-medium"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                technology becomes meaningful when it serves humanity
              </motion.span>
              ."
            </motion.p>
            
            {/* Enhanced Decorative Elements */}
            <motion.div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
        </motion.div>

        {/* Redesigned Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 px-4"
        >
          {[
            { number: "3", label: "Countries Volunteered", icon: Globe, color: "from-green-400 to-emerald-500" },
            { number: "200+", label: "Students Served", icon: Heart, color: "from-red-400 to-pink-500" },
            { number: "6+", label: "AI Projects Built", icon: Code, color: "from-cyan-400 to-blue-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                y: -5,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-center space-y-3">
                <motion.div
                  className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}
                  animate={{ 
                    rotateY: [0, 360],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    delay: index * 1,
                    ease: "easeInOut"
                  }}
                >
                  <stat.icon className="w-full h-full text-white" />
                </motion.div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-400 font-light">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>




      </div>
    </motion.div>
  );
};