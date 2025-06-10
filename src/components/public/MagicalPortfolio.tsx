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

  const goToNextSection = () => {
    if (isTransitioning || currentSection >= sections.length - 1) return;
    setIsTransitioning(true);
    setCurrentSection(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevSection = () => {
    if (isTransitioning || currentSection <= 0) return;
    setIsTransitioning(true);
    setCurrentSection(prev => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const sections = [
    { id: 'identity', component: IdentityCard, theme: 'cosmic' },
    { id: 'projects', component: ProjectUniverse, theme: 'tech' },
    { id: 'volunteering', component: VolunteeringGalaxy, theme: 'global' },
    { id: 'contact', component: ContactNebula, theme: 'ethereal' }
  ];

  useEffect(() => {
    // Complete loading after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goToNextSection();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPrevSection();
          break;
        case 'Home':
          e.preventDefault();
          !isTransitioning && setCurrentSection(0);
          break;
        case 'End':
          e.preventDefault();
          !isTransitioning && setCurrentSection(sections.length - 1);
          break;
      }
    };

    if (!isLoading) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isTransitioning, isLoading, currentSection]);

  // Add subtle scroll hints - detect scroll intent but don't force navigation
  useEffect(() => {
    let scrollTimeout: number;
    
    // Add transition to body for smooth scroll hint effect
    document.body.style.transition = 'transform 0.15s ease-out';
    
    const handleWheelHint = (e: WheelEvent) => {
      if (isTransitioning) return;
      
      // Show a subtle visual hint when user scrolls
      clearTimeout(scrollTimeout);
      const direction = e.deltaY > 0 ? 'down' : 'up';
      
      // Add a small visual feedback without forcing navigation
      document.body.style.transform = `translateY(${direction === 'down' ? '-2px' : '2px'})`;
      
      scrollTimeout = setTimeout(() => {
        document.body.style.transform = 'translateY(0)';
      }, 150);
    };

    if (!isLoading) {
      window.addEventListener('wheel', handleWheelHint, { passive: true });
      return () => {
        window.removeEventListener('wheel', handleWheelHint);
        clearTimeout(scrollTimeout);
        // Clean up transition when component unmounts
        document.body.style.transition = '';
        document.body.style.transform = '';
      };
    }
  }, [isLoading, isTransitioning]);

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
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
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
        onSectionChange={setCurrentSection}
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-20"
        >
          {CurrentComponent && <CurrentComponent />}
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation Arrows */}
      <div className="fixed inset-y-0 left-0 right-0 z-30 pointer-events-none">
        {/* Previous Section Arrow */}
        {currentSection > 0 && (
          <motion.button
            onClick={goToPrevSection}
            className="absolute top-1/2 left-4 sm:left-8 transform -translate-y-1/2 pointer-events-auto group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isTransitioning}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-white transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Previous
            </div>
          </motion.button>
        )}

        {/* Next Section Arrow */}
        {currentSection < sections.length - 1 && (
          <motion.button
            onClick={goToNextSection}
            className="absolute top-1/2 right-4 sm:right-8 transform -translate-y-1/2 pointer-events-auto group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isTransitioning}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Next
            </div>
          </motion.button>
        )}

        {/* Bottom Center Navigation - Enhanced Scroll Cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {currentSection < sections.length - 1 ? (
            <motion.button
              onClick={goToNextSection}
              className="group flex flex-col items-center space-y-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isTransitioning}
            >
              <div className="text-gray-400 text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                {currentSection === 0 ? 'explore my journey' : 'continue'}
              </div>
              <motion.div
                className="w-6 h-10 border-2 border-white/40 rounded-full relative overflow-hidden group-hover:border-white/60 transition-colors"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="w-1 h-2 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.button>
          ) : (
            <div className="text-center">
              <div className="text-gray-400 text-xs opacity-75">end of journey</div>
              <motion.div
                className="w-3 h-3 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full mx-auto mt-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Section Indicators - Repositioned to avoid arrow conflicts */}
      <div className="fixed right-4 bottom-20 sm:right-8 sm:bottom-1/2 sm:transform sm:-translate-y-1/2 z-50">
        <div className="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3">
          {sections.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => !isTransitioning && setCurrentSection(index)}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-white shadow-lg shadow-white/50' 
                  : 'bg-transparent hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              disabled={isTransitioning}
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