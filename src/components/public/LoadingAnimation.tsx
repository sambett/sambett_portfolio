import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo/Avatar */}
        <motion.div
          className="mb-8"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
          }}
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">SB</span>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to My Universe
          </h1>
          <p className="text-gray-300 text-lg">
            AI Engineer • Global Volunteer • Problem Solver
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-12 w-64 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="text-center mt-2 text-gray-400 text-sm">
            Loading Experience... {progress}%
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${20 + (i * 3)}%`,
                bottom: '10%',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};