import { motion } from 'framer-motion'
import { MapPin, Users, Heart, Award, ArrowRight } from 'lucide-react'

export const GlobalImpact = () => {
  const experiences = [
    {
      id: 1,
      country: 'Tunisia',
      flag: '🇹🇳',
      period: '2019-2021',
      role: 'Computer Science Student & Local Volunteer',
      organization: 'University of Tunis',
      impact: 'Foundation in AI and Machine Learning',
      description: 'Built my technical foundation while volunteering in local community tech initiatives. Developed my first AI projects and discovered my passion for using technology to solve real problems.',
      achievements: ['Graduated with honors', 'Led 3 community workshops', 'First ML project deployed'],
      stats: { students: 25, projects: 3 },
      color: 'primary'
    },
    {
      id: 2,
      country: 'Turkey',
      flag: '🇹🇷',
      period: '2021-2022',
      role: 'AI Research Assistant & Cultural Bridge',
      organization: 'Istanbul Technical University',
      impact: 'Cross-cultural AI research collaboration',
      description: 'Worked on advanced AI optimization algorithms while helping bridge cultural gaps between international students. Mentored peers in machine learning concepts and Turkish culture.',
      achievements: ['Published 2 research papers', 'Mentored 15 international students', 'Led AI study groups'],
      stats: { students: 40, projects: 5 },
      color: 'secondary'
    },
    {
      id: 3,
      country: 'Morocco',
      flag: '🇲🇦',
      period: '2022-2023',
      role: 'AI Consultant & Education Advocate',
      organization: 'Morocco Digital Initiative',
      impact: 'Democratizing AI education in underserved communities',
      description: 'Developed AI literacy programs for rural communities and young women in STEM. Created accessible learning materials in Arabic and French to break down language barriers in tech education.',
      achievements: ['Trained 80+ young women in AI', 'Created bilingual curriculum', 'Established 3 learning centers'],
      stats: { students: 120, projects: 8 },
      color: 'accent'
    },
    {
      id: 4,
      country: 'India',
      flag: '🇮🇳',
      period: '2023-Present',
      role: 'Senior AI Engineer & Global Impact Lead',
      organization: 'Tech for Good Initiative',
      impact: 'Scaling AI solutions for social impact',
      description: 'Leading diverse teams to develop AI solutions for healthcare, education, and sustainability. Mentoring the next generation of global tech leaders while working on projects that impact millions.',
      achievements: ['Led team of 12 engineers', 'Impacted 50,000+ users', 'Launched 4 major platforms'],
      stats: { students: 200, projects: 15 },
      color: 'success'
    }
  ]

  const totalStats = experiences.reduce((acc, exp) => ({
    students: acc.students + exp.stats.students,
    projects: acc.projects + exp.stats.projects
  }), { students: 0, projects: 0 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Global <span className="text-gradient">Impact</span> Journey
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            From Tunisia to India, building bridges through technology and empowering communities across continents
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary-400">{totalStats.students}+</div>
              <div className="text-sm text-slate-300">Students Taught</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-secondary-400">{totalStats.projects}+</div>
              <div className="text-sm text-slate-300">Projects Led</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-accent-400">4</div>
              <div className="text-sm text-slate-300">Countries</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-success-400">50K+</div>
              <div className="text-sm text-slate-300">Lives Impacted</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 via-accent-500 to-success-500 hidden md:block"></div>

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-slate-800 hidden md:block z-10"></div>

                <div className="md:ml-20">
                  <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-${experience.color}-500 transition-all duration-300 group`}>
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Country Info */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-6xl">{experience.flag}</div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{experience.country}</h3>
                            <p className="text-slate-300">{experience.period}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-slate-300">
                            <MapPin size={16} />
                            <span className="text-sm">{experience.organization}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <Award size={16} />
                            <span className="text-sm font-medium">{experience.role}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="text-center">
                            <div className={`text-2xl font-bold text-${experience.color}-400`}>
                              {experience.stats.students}
                            </div>
                            <div className="text-xs text-slate-400">Students</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold text-${experience.color}-400`}>
                              {experience.stats.projects}
                            </div>
                            <div className="text-xs text-slate-400">Projects</div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h4 className={`text-lg font-semibold text-${experience.color}-400 mb-2`}>
                            {experience.impact}
                          </h4>
                          <p className="text-slate-300 leading-relaxed">
                            {experience.description}
                          </p>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                            <Heart size={16} className="mr-2" />
                            Key Achievements
                          </h5>
                          <div className="grid md:grid-cols-3 gap-3">
                            {experience.achievements.map((achievement, i) => (
                              <div 
                                key={i}
                                className="flex items-center space-x-2 text-sm text-slate-300"
                              >
                                <ArrowRight size={12} className={`text-${experience.color}-400 flex-shrink-0`} />
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Arrow for Mobile */}
                {index < experiences.length - 1 && (
                  <div className="flex justify-center mt-8 md:hidden">
                    <ArrowRight size={24} className="text-slate-600 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Make Global Impact Together?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Let's collaborate on technology solutions that transcend borders and empower communities worldwide.
            </p>
            <a
              href="#contact"
              className="btn-primary inline-flex items-center"
            >
              Start a Conversation
              <Users size={20} className="ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}