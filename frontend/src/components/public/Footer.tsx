import { motion } from 'framer-motion'
import { Heart, ArrowUp, Mail, Linkedin, Github, Twitter, Globe, Code } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Global Impact', href: '#impact' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ]

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/selma-bettaieb', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/selma-bettaieb', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/selma_bettaieb', label: 'Twitter' },
    { icon: Mail, href: 'mailto:selma.bettaieb@email.com', label: 'Email' }
  ]

  const skills = [
    'AI & Machine Learning',
    'Data Science',
    'Cloud Computing',
    'Software Engineering',
    'Global Collaboration',
    'Community Impact'
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h3 className="text-3xl font-bold text-gradient mb-4">Selma Bettaieb</h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                  AI Engineer building intelligent solutions that bridge cultures and create global impact. 
                  From Tunisia to India, technology with purpose.
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 hover:border-primary-500 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Global Impact Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">200+</div>
                  <div className="text-xs text-slate-400">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-400">4</div>
                  <div className="text-xs text-slate-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">15+</div>
                  <div className="text-xs text-slate-400">Projects</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-slate-300 hover:text-primary-400 transition-colors duration-200 group"
                  >
                    <span className="flex items-center">
                      {link.label}
                      <ArrowUp size={14} className="ml-2 opacity-0 group-hover:opacity-100 transform rotate-45 transition-all duration-200" />
                    </span>
                  </a>
                ))}
              </nav>
            </motion.div>

            {/* Connect Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">Let's Connect</h4>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors group"
                      aria-label={social.label}
                    >
                      <IconComponent size={20} className="text-slate-300 group-hover:text-primary-400 transition-colors" />
                    </motion.a>
                  )
                })}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-300">
                  <Mail size={16} className="text-primary-400" />
                  <span className="text-sm">selma.bettaieb@email.com</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Globe size={16} className="text-secondary-400" />
                  <span className="text-sm">Available for global collaborations</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="pt-4">
                <h5 className="text-sm font-semibold text-white mb-2">Stay Updated</h5>
                <p className="text-xs text-slate-400 mb-3">
                  Get notified about new projects and insights
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                  <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-r-lg transition-colors">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 text-slate-400 text-sm"
              >
                <span>© {currentYear} Selma Bettaieb. Made with</span>
                <Heart size={16} className="text-red-400 animate-pulse" />
                <span>and</span>
                <Code size={16} className="text-primary-400" />
                <span>for global impact.</span>
              </motion.div>

              {/* Scroll to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-slate-400 hover:text-primary-400 transition-colors text-sm group"
              >
                <span>Back to top</span>
                <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </div>

          {/* Additional Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <div className="text-xs text-slate-500 space-y-1">
              <p>Built with React, TypeScript, Tailwind CSS, and lots of ☕</p>
              <p>Deployed with love from Tunisia 🇹🇳 to the world 🌍</p>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 via-accent-500 to-success-500"></div>
      </div>
    </footer>
  )
}