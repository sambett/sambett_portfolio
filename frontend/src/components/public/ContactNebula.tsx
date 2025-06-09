import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Calendar, MessageCircle, Send, Star } from 'lucide-react';

export const ContactNebula: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'collaboration'
  });

  const contactOptions = [
    {
      id: 'email',
      icon: Mail,
      title: 'Direct Email',
      description: 'For detailed discussions and project proposals',
      link: 'mailto:selma.bettaieb@example.com',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-900/20 border-blue-400/30'
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Professional networking and career opportunities',
      link: 'https://linkedin.com/in/selma-bettaieb',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-900/20 border-blue-400/30'
    },
    {
      id: 'github',
      icon: Github,
      title: 'GitHub',
      description: 'Explore my code and contribute to projects',
      link: 'https://github.com/sambett',
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-900/20 border-gray-400/30'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Schedule Meeting',
      description: 'Book a time for video calls and consultations',
      link: '#booking',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-900/20 border-green-400/30'
    }
  ];

  const handleContactClick = (option: any) => {
    if (option.id === 'calendar') {
      // Future: Implement calendar booking
      alert('Calendar booking feature coming soon!');
    } else {
      window.open(option.link, '_blank');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '', type: 'collaboration' });
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Contact Nebula
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to create something amazing together? Whether it's AI innovation, 
            global collaboration, or just a friendly chat—let's connect across the universe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Options */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold text-white mb-8 text-center lg:text-left">
              Choose Your Communication Channel
            </h3>
            
            {contactOptions.map((option) => {
              const IconComponent = option.icon;
              
              return (
                <motion.div
                  key={option.id}
                  className={`relative p-6 rounded-2xl ${option.bgColor} border backdrop-blur-sm cursor-pointer group overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContactClick(option)}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${option.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300">
                        {option.title}
                      </h4>
                      <p className="text-gray-400 mt-1">
                        {option.description}
                      </p>
                    </div>
                    
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <Send className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Floating Particles on Hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          left: `${15 + i * 10}%`,
                          bottom: '20%',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Contact Form */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold text-white mb-8 text-center lg:text-left">
              Quick Message Portal
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Project Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="collaboration">AI/Tech Collaboration</option>
                  <option value="volunteer">Volunteer Opportunity</option>
                  <option value="consulting">Consulting Project</option>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  placeholder="Tell me about your project, idea, or how we can work together..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                <span>Send Message to the Universe</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Fun Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          variants={itemVariants}
        >
          {[
            { icon: MessageCircle, value: "24h", label: "Average Response Time" },
            { icon: Star, value: "3+", label: "Continents Connected" },
            { icon: Calendar, value: "Open", label: "For New Projects" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="space-y-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative mx-auto w-16 h-16">
                <stat.icon className="w-8 h-8 mx-auto text-purple-400" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <blockquote className="text-xl text-gray-300 italic max-w-3xl mx-auto">
            "The best solutions emerge when different perspectives meet across cultures, 
            technologies, and dreams. Let's build something meaningful together."
          </blockquote>
          <div className="mt-4 text-purple-400 font-semibold">- Selma Bettaieb</div>
        </motion.div>
      </motion.div>
    </div>
  );
};