import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Calendar, Download, Award, ExternalLink, FileText, GraduationCap, Building } from 'lucide-react';

export const ContactNebula: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<string>('');

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

  const certificates = [
    {
      id: 'aiesec',
      title: 'AIESEC Leadership',
      description: 'Global volunteer and leadership certificates',
      icon: Award,
      color: 'from-orange-400 to-red-400',
      bgColor: 'bg-orange-900/20 border-orange-400/30',
      count: '3 Certificates'
    },
    {
      id: 'internships',
      title: 'Professional Experience',
      description: 'Internship completion and recommendation letters',
      icon: Building,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-900/20 border-purple-400/30',
      count: '5 Documents'
    },
    {
      id: 'online',
      title: 'Online Certifications',
      description: 'AI, DevOps, and technical skill certifications',
      icon: GraduationCap,
      color: 'from-green-400 to-teal-400',
      bgColor: 'bg-green-900/20 border-green-400/30',
      count: '12+ Certificates'
    },
    {
      id: 'academic',
      title: 'Academic Records',
      description: 'University transcripts and degrees',
      icon: FileText,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-900/20 border-blue-400/30',
      count: 'Official Transcripts'
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

  const handleDownloadCV = () => {
    setDownloadStatus('Downloading...');
    // Simulate download
    setTimeout(() => {
      setDownloadStatus('Downloaded!');
      setTimeout(() => setDownloadStatus(''), 2000);
    }, 1000);
    
    // Here you would implement actual CV download
    // window.open('/cv/selma-bettaieb-cv.pdf', '_blank');
  };

  const handleCertificateClick = (cert: any) => {
    // Future: Implement certificate viewing/download
    alert(`Opening ${cert.title} certificates...`);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Options */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center lg:text-left px-4 lg:px-0">
              Choose Your Communication Channel
            </h3>
            
            {contactOptions.map((option) => {
              const IconComponent = option.icon;
              
              return (
                <motion.div
                  key={option.id}
                  className={`relative p-4 sm:p-6 mx-4 lg:mx-0 rounded-2xl ${option.bgColor} border backdrop-blur-sm cursor-pointer group overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContactClick(option)}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${option.color} text-white flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg sm:text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300">
                        {option.title}
                      </h4>
                      <p className="text-gray-400 mt-1 text-sm sm:text-base line-clamp-2">
                        {option.description}
                      </p>
                    </div>
                    
                    <div className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
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

          {/* Download CV & Certificates */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center lg:text-left px-4 lg:px-0">
              Download CV & Certificates
            </h3>
            
            {/* Download CV Card */}
            <motion.div
              className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-400/40 rounded-2xl p-6 mx-4 lg:mx-0 cursor-pointer group overflow-hidden relative"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadCV}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex items-center space-x-4">
                {/* Download Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300">
                    Download My CV
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Get my latest resume with projects, experience, and achievements
                  </p>
                  <div className="text-indigo-400 text-sm font-medium">
                    {downloadStatus || 'PDF Format • Updated June 2025'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Certificates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4 lg:mx-0">
              {certificates.map((cert) => {
                const IconComponent = cert.icon;
                
                return (
                  <motion.div
                    key={cert.id}
                    className={`relative p-4 rounded-xl ${cert.bgColor} border backdrop-blur-sm cursor-pointer group overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCertificateClick(cert)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      {/* Certificate Icon */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-semibold text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 truncate">
                            {cert.title}
                          </h5>
                          <p className="text-xs text-gray-400">
                            {cert.count}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-xs line-clamp-2 mb-2">
                        {cert.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className={`text-xs font-medium bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}>
                          View All
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mx-4 lg:mx-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-400">20+</div>
                  <div className="text-xs text-gray-400">Total Certificates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">4</div>
                  <div className="text-xs text-gray-400">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">3+</div>
                  <div className="text-xs text-gray-400">Years Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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