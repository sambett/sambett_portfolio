import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Code, Database, Cloud, Sparkles, Zap } from 'lucide-react'

export const SkillsConstellation = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const skillCategories = [
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      icon: Brain,
      color: 'primary',
      skills: [
        { name: 'TensorFlow', level: 95, experience: '3+ years' },
        { name: 'PyTorch', level: 90, experience: '2+ years' },
        { name: 'Scikit-learn', level: 95, experience: '4+ years' },
        { name: 'OpenAI APIs', level: 88, experience: '2+ years' },
        { name: 'Computer Vision', level: 85, experience: '3+ years' },
        { name: 'NLP', level: 90, experience: '3+ years' },
        { name: 'Deep Learning', level: 92, experience: '3+ years' },
        { name: 'MLOps', level: 80, experience: '2+ years' }
      ]
    },
    {
      id: 'programming',
      name: 'Programming Languages',
      icon: Code,
      color: 'secondary',
      skills: [
        { name: 'Python', level: 95, experience: '5+ years' },
        { name: 'JavaScript/TypeScript', level: 90, experience: '4+ years' },
        { name: 'Java', level: 85, experience: '3+ years' },
        { name: 'C++', level: 80, experience: '2+ years' },
        { name: 'R', level: 75, experience: '2+ years' },
        { name: 'SQL', level: 88, experience: '4+ years' },
        { name: 'MATLAB', level: 70, experience: '2+ years' }
      ]
    },
    {
      id: 'data',
      name: 'Data & Analytics',
      icon: Database,
      color: 'accent',
      skills: [
        { name: 'Pandas', level: 95, experience: '4+ years' },
        { name: 'NumPy', level: 95, experience: '4+ years' },
        { name: 'Apache Spark', level: 85, experience: '2+ years' },
        { name: 'Elasticsearch', level: 80, experience: '2+ years' },
        { name: 'MongoDB', level: 85, experience: '3+ years' },
        { name: 'PostgreSQL', level: 90, experience: '3+ years' },
        { name: 'Power BI', level: 75, experience: '2+ years' }
      ]
    },
    {
      id: 'cloud-devops',
      name: 'Cloud & DevOps',
      icon: Cloud,
      color: 'success',
      skills: [
        { name: 'AWS', level: 88, experience: '3+ years' },
        { name: 'Docker', level: 90, experience: '3+ years' },
        { name: 'Kubernetes', level: 80, experience: '2+ years' },
        { name: 'Terraform', level: 75, experience: '2+ years' },
        { name: 'CI/CD', level: 85, experience: '3+ years' },
        { name: 'Linux', level: 88, experience: '4+ years' },
        { name: 'Git', level: 95, experience: '5+ years' }
      ]
    }
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <section id="skills" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Technical <span className="text-gradient">Constellation</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A comprehensive skill set spanning AI, data science, and software engineering—refined through global experience
          </p>
        </motion.div>

        {/* Skills Constellation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {skillCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                variants={categoryVariants}
                className="relative"
              >
                <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-${category.color}-500 transition-all duration-300 group`}>
                  {/* Category Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`p-3 rounded-xl bg-${category.color}-500/20 border border-${category.color}-500/30`}>
                      <IconComponent size={32} className={`text-${category.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                      <p className="text-slate-400">{category.skills.length} technologies</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">{skill.experience}</span>
                            <span className={`text-sm font-bold text-${category.color}-400`}>
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-400 rounded-full relative`}
                          >
                            {/* Shimmer Effect */}
                            <motion.div
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                          </motion.div>
                        </div>

                        {/* Hover Tooltip */}
                        {hoveredSkill === skill.name && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-full left-0 mt-2 p-3 bg-slate-800 rounded-lg border border-slate-700 z-10 min-w-48"
                          >
                            <div className="text-sm">
                              <div className="font-semibold text-white mb-1">{skill.name}</div>
                              <div className="text-slate-400">Experience: {skill.experience}</div>
                              <div className="text-slate-400">Proficiency: {skill.level}%</div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Category Stats */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-${category.color}-400`}>
                          {Math.round(category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length)}%
                        </div>
                        <div className="text-xs text-slate-500">Avg. Level</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-${category.color}-400`}>
                          {category.skills.length}
                        </div>
                        <div className="text-xs text-slate-500">Technologies</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-${category.color}-400`}>
                          {Math.max(...category.skills.map(s => parseInt(s.experience)))}+
                        </div>
                        <div className="text-xs text-slate-500">Max Exp</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Sparkles size={32} className="text-primary-400" />
              <h3 className="text-2xl font-bold text-white">Continuous Learning</h3>
              <Zap size={32} className="text-accent-400" />
            </div>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Technology evolves rapidly, and so do I. Currently exploring cutting-edge developments in 
              Large Language Models, Edge AI, and Quantum Computing applications.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['LLMs', 'Edge AI', 'Quantum Computing', 'Web3', 'AR/VR', 'Blockchain'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 hover:border-primary-500 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mouse Follower */}
      {hoveredSkill && (
        <motion.div
          animate={{
            x: mousePosition.x,
            y: mousePosition.y
          }}
          className="absolute pointer-events-none z-50"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%)',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
    </section>
  )
}