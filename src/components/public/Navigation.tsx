import React from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, Globe, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (section: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSectionChange,
}) => {
  const navItems = [
    { id: 0, icon: Home, label: 'Identity', color: 'text-purple-400' },
    { id: 1, icon: Briefcase, label: 'Projects', color: 'text-blue-400' },
    { id: 2, icon: Globe, label: 'Global Impact', color: 'text-green-400' },
    { id: 3, icon: MessageCircle, label: 'Contact', color: 'text-pink-400' },
  ];

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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <div className="text-white font-semibold text-lg">
              Selma Bettaieb
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                      : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
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

      {/* Floating Action Buttons - Quick Actions */}
      <motion.div
        className="fixed bottom-6 left-6 z-40 space-y-3"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {[
          { icon: MessageCircle, action: () => onSectionChange(3), color: 'from-pink-500 to-purple-500', label: 'Contact' },
          { icon: Briefcase, action: () => onSectionChange(1), color: 'from-blue-500 to-cyan-500', label: 'Projects' },
        ].map((action, index) => (
          <motion.button
            key={index}
            onClick={action.action}
            className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group relative`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <action.icon className="w-6 h-6 text-white" />
            
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {action.label}
            </div>

            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        ))}
      </motion.div>
    </>
  );
};