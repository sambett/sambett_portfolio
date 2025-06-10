import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Home, Briefcase, Globe, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (section: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  totalSections,
  onSectionChange,
}) => {
  const navItems = [
    { id: 0, icon: Home, label: 'Identity', color: 'text-purple-400' },
    { id: 1, icon: Briefcase, label: 'Projects', color: 'text-blue-400' },
    { id: 2, icon: Globe, label: 'Global Impact', color: 'text-green-400' },
    { id: 3, icon: MessageCircle, label: 'Contact', color: 'text-pink-400' },
  ];

  const goToPrevSection = () => {
    if (currentSection > 0) {
      onSectionChange(currentSection - 1);
    }
  };

  const goToNextSection = () => {
    if (currentSection < totalSections - 1) {
      onSectionChange(currentSection + 1);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 p-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img
                  src="/photo.jpg"
                  alt="Selma Bettaieb"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">SB</div>';
                  }}
                />
              </div>
            </div>
            <div className="text-white font-semibold text-lg">
              Selma Bettaieb
            </div>
          </motion.div>

          {/* Navigation Menu - Desktop - Positioned More Left */}
          <div className="hidden md:flex items-center space-x-4 ml-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-xs ${isActive 
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                      : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? item.color : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Left Side Arrow Navigation - Positioned Left to Avoid Star */}
      <motion.div
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 space-y-4"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {/* Up Arrow */}
        <motion.button
          onClick={goToPrevSection}
          disabled={currentSection === 0}
          className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
            currentSection === 0
              ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-110'
          }`}
          whileHover={currentSection > 0 ? { scale: 1.1 } : {}}
          whileTap={currentSection > 0 ? { scale: 0.9 } : {}}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>

        {/* Section Indicator */}
        <div className="flex flex-col items-center space-y-2">
          {Array.from({ length: totalSections }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onSectionChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-gradient-to-r from-purple-400 to-cyan-400 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>

        {/* Down Arrow */}
        <motion.button
          onClick={goToNextSection}
          disabled={currentSection === totalSections - 1}
          className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
            currentSection === totalSections - 1
              ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-110'
          }`}
          whileHover={currentSection < totalSections - 1 ? { scale: 1.1 } : {}}
          whileTap={currentSection < totalSections - 1 ? { scale: 0.9 } : {}}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Mobile Navigation Menu - Positioned Right */}
      <motion.div
        className="fixed top-20 right-6 z-40 md:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10 p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 border border-white/20' 
                    : 'hover:bg-white/5'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};