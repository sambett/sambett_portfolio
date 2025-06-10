import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Users, Lightbulb, Book, Heart, Star } from 'lucide-react';

interface CulturalInsight {
  country: string;
  flag: string;
  language: string;
  insight: string;
  techApplication: string;
  projects: string[];
  culturalValue: string;
  aiPerspective: string;
  position: { x: number; y: number };
  color: string;
}

interface Bridge {
  from: string;
  to: string;
  connection: string;
  strength: number;
}

export const CulturalBridge: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const culturalInsights: CulturalInsight[] = [
    {
      country: "Tunisia",
      flag: "🇹🇳",
      language: "Arabic/French",
      insight: "Bridging tradition with innovation - seeing technology as a tool to preserve culture while enabling progress",
      techApplication: "Built DocConnect considering local housing customs and family values in student accommodation",
      projects: ["DocConnect", "Local AI Solutions"],
      culturalValue: "Community-first approach to problem solving",
      aiPerspective: "AI should enhance human connection, not replace it",
      position: { x: 50, y: 60 },
      color: "bg-red-500"
    },
    {
      country: "Turkey",
      flag: "🇹🇷", 
      language: "Turkish/English",
      insight: "Cross-cultural education reveals universal learning patterns while respecting individual cultural contexts",
      techApplication: "Teaching English with AI-assisted language tools that adapt to cultural communication styles",
      projects: ["AIESEC Education", "Language Learning AI"],
      culturalValue: "Education as a bridge between cultures",
      aiPerspective: "AI can break language barriers while preserving cultural nuances",
      position: { x: 55, y: 35 },
      color: "bg-red-600"
    },
    {
      country: "Morocco",
      flag: "🇲🇦",
      language: "Arabic/French",
      insight: "Traditional craftsmanship teaches patience and iterative improvement - principles that apply to AI development",
      techApplication: "Applying artisan's attention to detail and user-centered design in AI solutions",
      projects: ["User Experience Research", "Cultural AI Ethics"],
      culturalValue: "Craftsmanship and attention to detail",
      aiPerspective: "AI systems should be crafted with care, not just optimized for metrics",
      position: { x: 48, y: 45 },
      color: "bg-green-600"
    },
    {
      country: "France",
      flag: "🇫🇷",
      language: "French",
      insight: "Academic rigor and philosophical thinking shape how we approach AI ethics and responsible innovation",
      techApplication: "Structured thinking and ethical frameworks in AI system design and documentation",
      projects: ["AI Ethics Research", "Technical Documentation"],
      culturalValue: "Intellectual rigor and structured thinking",
      aiPerspective: "AI development requires philosophical reflection, not just technical skill",
      position: { x: 52, y: 40 },
      color: "bg-blue-600"
    },
    {
      country: "India",
      flag: "🇮🇳",
      language: "English/Hindi",
      insight: "Upcoming experience in AI healthcare - anticipating how diverse cultural approaches to wellness can inform AI solutions",
      techApplication: "Designing AI healthcare tools that respect cultural approaches to medicine and patient care",
      projects: ["Upcoming Healthcare AI", "Cultural Sensitivity Research"],
      culturalValue: "Holistic approach to problem-solving",
      aiPerspective: "AI should understand and respect diverse cultural definitions of wellbeing",
      position: { x: 70, y: 50 },
      color: "bg-orange-600"
    }
  ];

  const culturalBridges: Bridge[] = [
    {
      from: "Tunisia",
      to: "Turkey", 
      connection: "Shared approach to technology-enhanced education",
      strength: 9
    },
    {
      from: "Morocco",
      to: "Tunisia",
      connection: "Arabic cultural values in tech design",
      strength: 8
    },
    {
      from: "France",
      to: "Tunisia",
      connection: "Bilingual perspective in AI development",
      strength: 7
    },
    {
      from: "Turkey",
      to: "India",
      connection: "Cross-cultural education methodologies",
      strength: 6
    },
    {
      from: "France",
      to: "India",
      connection: "Academic rigor meets practical application",
      strength: 7
    }
  ];

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

  const countryVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountry(selectedCountry === country ? null : country);
    
    // Show connections for selected country
    if (selectedCountry !== country) {
      const connections = culturalBridges
        .filter(bridge => bridge.from === country || bridge.to === country)
        .map(bridge => `${bridge.from}-${bridge.to}`);
      setActiveConnections(connections);
    } else {
      setActiveConnections([]);
    }
  };

  const getBridgePoints = (from: string, to: string) => {
    const fromCountry = culturalInsights.find(c => c.country === from);
    const toCountry = culturalInsights.find(c => c.country === to);
    
    if (!fromCountry || !toCountry) return null;
    
    return {
      from: fromCountry.position,
      to: toCountry.position
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 px-4"
          variants={countryVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Cultural Bridge
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            How my global journey across cultures shapes my approach to AI development. 
            Each experience adds a unique lens to technology solutions.
          </p>
        </motion.div>

        {/* World Map Visualization */}
        <motion.div
          className="relative w-full h-96 mb-12"
          variants={countryVariants}
        >
          {/* Background World Map Silhouette */}
          <div className="absolute inset-0 opacity-10">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full"
              fill="currentColor"
            >
              {/* Simplified world map paths */}
              <path d="M200,200 Q250,180 300,200 L350,180 Q400,190 450,200 L500,190 Q550,200 600,210 L650,200 Q700,180 750,200" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.3" />
              <path d="M150,250 Q200,230 250,250 L300,240 Q350,250 400,260 L450,250 Q500,260 550,270" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.3" />
            </svg>
          </div>

          {/* Cultural Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {culturalBridges.map((bridge, index) => {
              const points = getBridgePoints(bridge.from, bridge.to);
              if (!points) return null;
              
              const isActive = activeConnections.includes(`${bridge.from}-${bridge.to}`);
              
              return (
                <motion.g key={`${bridge.from}-${bridge.to}`}>
                  <motion.path
                    d={`M${points.from.x * 10},${points.from.y * 4} Q${((points.from.x + points.to.x) / 2) * 10},${Math.min(points.from.y, points.to.y) * 4 - 50} ${points.to.x * 10},${points.to.y * 4}`}
                    stroke={isActive ? "#06d6a0" : "rgba(255,255,255,0.2)"}
                    strokeWidth={isActive ? "3" : "1"}
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: isActive ? 1 : 0.3,
                      strokeWidth: isActive ? 3 : 1
                    }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                  
                  {/* Connection strength indicator */}
                  {isActive && (
                    <motion.circle
                      cx={((points.from.x + points.to.x) / 2) * 10}
                      cy={Math.min(points.from.y, points.to.y) * 4 - 50}
                      r="4"
                      fill="#06d6a0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <motion.animate
                        attributeName="r"
                        values="4;8;4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </motion.circle>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Country Points */}
          {culturalInsights.map((insight, index) => (
            <motion.div
              key={insight.country}
              className="absolute cursor-pointer group"
              style={{
                left: `${insight.position.x}%`,
                top: `${insight.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              variants={countryVariants}
              onClick={() => handleCountryClick(insight.country)}
              onHoverStart={() => setHoveredInsight(insight.country)}
              onHoverEnd={() => setHoveredInsight(null)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Country Flag Circle */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white/30 backdrop-blur-sm ${
                  selectedCountry === insight.country ? 'ring-4 ring-cyan-400/50' : ''
                }`}
                style={{
                  background: selectedCountry === insight.country 
                    ? 'radial-gradient(circle, rgba(6,214,160,0.3) 0%, rgba(6,214,160,0.1) 100%)'
                    : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                }}
                animate={{
                  boxShadow: selectedCountry === insight.country 
                    ? ['0 0 0px rgba(6,214,160,0.4)', '0 0 20px rgba(6,214,160,0.4)', '0 0 0px rgba(6,214,160,0.4)']
                    : ['0 0 0px rgba(255,255,255,0.2)', '0 0 8px rgba(255,255,255,0.2)', '0 0 0px rgba(255,255,255,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {insight.flag}
              </motion.div>

              {/* Country Label */}
              <motion.div
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {insight.country}
              </motion.div>

              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Country Detail */}
        <AnimatePresence mode="wait">
          {selectedCountry && (
            <motion.div
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {(() => {
                const insight = culturalInsights.find(c => c.country === selectedCountry);
                if (!insight) return null;

                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-4xl">{insight.flag}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{insight.country}</h3>
                        <p className="text-cyan-300">{insight.language}</p>
                      </div>
                    </div>

                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cultural Insight */}
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <Heart className="w-5 h-5" />
                          <span className="font-semibold">Cultural Insight</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{insight.insight}</p>
                      </motion.div>

                      {/* AI Perspective */}
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-2 text-purple-400">
                          <Lightbulb className="w-5 h-5" />
                          <span className="font-semibold">AI Perspective</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{insight.aiPerspective}</p>
                      </motion.div>

                      {/* Tech Application */}
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center space-x-2 text-cyan-400">
                          <Globe className="w-5 h-5" />
                          <span className="font-semibold">Tech Application</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{insight.techApplication}</p>
                      </motion.div>

                      {/* Projects */}
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Star className="w-5 h-5" />
                          <span className="font-semibold">Related Projects</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insight.projects.map((project, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm border border-yellow-400/30"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Active Connections */}
                    {activeConnections.length > 0 && (
                      <motion.div
                        className="pt-6 border-t border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center space-x-2 text-emerald-400 mb-3">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">Cultural Connections</span>
                        </div>
                        <div className="space-y-2">
                          {culturalBridges
                            .filter(bridge => bridge.from === selectedCountry || bridge.to === selectedCountry)
                            .map((bridge, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10"
                              >
                                <div className="font-medium text-white mb-1">
                                  {bridge.from === selectedCountry ? `→ ${bridge.to}` : `← ${bridge.from}`}
                                </div>
                                <div>{bridge.connection}</div>
                                <div className="flex items-center mt-2">
                                  <span className="text-xs text-gray-400 mr-2">Strength:</span>
                                  <div className="flex space-x-1">
                                    {[...Array(10)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-1 rounded-full ${
                                          i < bridge.strength ? 'bg-emerald-400' : 'bg-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Philosophy */}
        <motion.div
          className="text-center bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/10"
          variants={countryVariants}
        >
          <Book className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">Cross-Cultural AI Philosophy</h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            My approach to AI development is shaped by the understanding that technology is never culturally neutral. 
            Each cultural experience has taught me that the best AI solutions emerge when we combine diverse perspectives, 
            respect cultural contexts, and design with empathy for different ways of thinking and problem-solving.
          </p>
        </motion.div>

        {/* Interaction Hint */}
        <motion.div
          className="text-center mt-8 text-gray-400 text-sm"
          variants={countryVariants}
        >
          <p>Click on any country to explore cultural insights • Hover to see connections</p>
        </motion.div>
      </motion.div>
    </div>
  );
};