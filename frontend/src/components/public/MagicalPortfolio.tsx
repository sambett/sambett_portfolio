import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingAnimation } from './LoadingAnimation';
import { IdentityCard } from './IdentityCard';
import { ProjectUniverse } from './ProjectUniverse';
import { VolunteeringGalaxy } from './VolunteeringGalaxy';
import { ContactNebula } from './ContactNebula';
import { Navigation } from './Navigation';

interface MagicalPortfolioProps {
  className?: string;
}

export const MagicalPortfolio: React.FC<MagicalPortfolioProps> = ({ className = '' }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sections = [
    { id: 'identity', component: IdentityCard, theme: 'cosmic' },
    { id: 'projects', component: ProjectUniverse, theme: 'tech' },
    { id: 'volunteering', component: VolunteeringGalaxy, theme: 'global' },
    { id: 'contact', component: ContactNebula, theme: 'ethereal' }
  ];

  const handleSectionChange = (newSection: number) => {
    if (isTransitioning || newSection === currentSection) return;
    
    setIsTransitioning(true);
    setCurrentSection(newSection);
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    // Complete loading after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < sections.length - 1) {
        handleSectionChange(currentSection + 1);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
        handleSectionChange(currentSection - 1);
      } else if (e.key >= '1' && e.key <= '4') {
        const targetSection = parseInt(e.key) - 1;
        if (targetSection >= 0 && targetSection < sections.length) {
          handleSectionChange(targetSection);
        }
      }
    };

    if (!isLoading) {
      // Add keyboard navigation only
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentSection, isTransitioning, isLoading]);

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'cosmic':
        return 'from-purple-900 via-blue-900 to-indigo-900';
      case 'tech':
        return 'from-blue-900 via-cyan-900 to-teal-900';
      case 'global':
        return 'from-green-900 via-emerald-900 to-teal-900';
      case 'ethereal':
        return 'from-pink-900 via-purple-900 to-indigo-900';
      default:
        return 'from-gray-900 via-black to-gray-900';
    }
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} />;
  }

  const CurrentComponent = sections[currentSection]?.component;
  const currentTheme = sections[currentSection]?.theme || 'cosmic';

  return (
    <div className={`relative ${className}`} style={{ minHeight: '100vh' }}>
      {/* Dynamic Background */}
      <motion.div 
        className={`fixed inset-0 bg-gradient-to-br ${getThemeColors(currentTheme)}`}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navigation 
        currentSection={currentSection}
        totalSections={sections.length}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 min-h-screen"
        >
          {CurrentComponent && <CurrentComponent />}
        </motion.div>
      </AnimatePresence>

      {/* Section Indicators */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-3">
          {sections.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleSectionChange(index)}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-white shadow-lg shadow-white/50' 
                  : 'bg-transparent hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
          animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};