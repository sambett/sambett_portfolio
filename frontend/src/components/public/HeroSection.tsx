import { motion } from 'framer-motion'
import { ChevronDown, MapPin, Globe, Sparkles } from 'lucide-react'

export const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium border border-primary-200"
            >
              <Sparkles size={16} />
              <span>AI Engineer & Global Impact Advocate</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              Building{' '}
              <span className="text-gradient">intelligent</span>{' '}
              solutions across{' '}
              <span className="text-gradient">continents</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-slate-600 leading-relaxed max-w-xl"
            >
              From Tunisia to Turkey, Morocco to India—I create AI-powered solutions 
              that solve real-world problems and bridge cultural divides. Technology 
              with purpose, impact, and global perspective.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Globe size={20} className="text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">4+ Countries</div>
                  <div className="text-sm text-slate-600">Global Experience</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <MapPin size={20} className="text-secondary-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">200+ Students</div>
                  <div className="text-sm text-slate-600">Lives Impacted</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 pt-8"
            >
              <button
                onClick={scrollToProjects}
                className="btn-primary group"
              >
                Explore My Work
                <ChevronDown size={20} className="ml-2 group-hover:translate-y-1 transition-transform" />
              </button>
              <a
                href="#contact"
                className="btn-secondary"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Animated Globe Representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-80 h-80 rounded-full border-2 border-dashed border-primary-300"
                >
                  {/* Country Flags/Dots */}
                  <motion.div
                    className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl"
                    whileHover={{ scale: 1.2 }}
                  >
                    🇹🇳
                  </motion.div>
                  <motion.div
                    className="absolute top-1/3 right-1/4 w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xl"
                    whileHover={{ scale: 1.2 }}
                  >
                    🇹🇷
                  </motion.div>
                  <motion.div
                    className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white text-xl"
                    whileHover={{ scale: 1.2 }}
                  >
                    🇲🇦
                  </motion.div>
                  <motion.div
                    className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white text-xl"
                    whileHover={{ scale: 1.2 }}
                  >
                    🇮🇳
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Central AI Symbol */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-24 h-24 bg-neural-gradient rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles size={32} className="text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={scrollToProjects}
          className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronDown size={24} className="text-slate-600" />
        </button>
      </motion.div>
    </section>
  )
}