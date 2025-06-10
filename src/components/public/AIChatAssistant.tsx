import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Sparkles, ExternalLink, Github } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  links?: { text: string; url: string; type: 'github' | 'demo' | 'external' }[];
}

interface KnowledgeBase {
  projects: { [key: string]: any };
  skills: { [key: string]: any };
  experiences: { [key: string]: any };
  quickFacts: { [key: string]: string };
}

export const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated knowledge base - in a real app this would come from your data
  const knowledgeBase: KnowledgeBase = {
    projects: {
      'neurorag': {
        name: 'NeuroRAG',
        description: 'Hackathon-winning conversational AI using retrieval-augmented generation',
        tech: ['RAG', 'NLP', 'Python', 'Streamlit'],
        award: 'Hackathon Winner - Most Practical AI Application',
        github: 'https://github.com/sambett/neurorag'
      },
      'docconnect': {
        name: 'DocConnect',
        description: 'Student housing solution serving 200+ users in Tunisia',
        tech: ['React', 'Node.js', 'MongoDB'],
        impact: '200+ users helped find housing in Tunisia'
      },
      'helmet-detection': {
        name: 'Helmet Detection',
        description: 'Computer vision system for safety monitoring',
        tech: ['Computer Vision', 'Python', 'OpenCV'],
        accuracy: '95% detection accuracy'
      }
    },
    skills: {
      'ai': ['RAG Systems', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch'],
      'frontend': ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
      'backend': ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
      'languages': ['Arabic', 'French', 'English', 'Turkish', 'Spanish']
    },
    experiences: {
      'tunisia': 'Home base - Built DocConnect for local student housing needs',
      'turkey': 'AIESEC volunteer - Taught English to 40+ students',
      'morocco': 'Cultural exchange and skills training',
      'india': 'Upcoming AI healthcare initiative'
    },
    quickFacts: {
      'location': 'Based in Tunisia 🇹🇳',
      'languages': 'Speaks 5 languages: Arabic, French, English, Turkish, Spanish',
      'education': 'AI Engineering student with focus on practical applications',
      'passion': 'Building AI solutions that bridge cultures and serve communities',
      'hackathons': 'Won hackathon for most practical AI application with NeuroRAG',
      'volunteering': 'Volunteer across 4 countries teaching and learning'
    }
  };

  // Predefined responses for common questions
  const getResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    const timestamp = new Date();
    
    // Project-related questions
    if (message.includes('neurorag') || message.includes('rag')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "NeuroRAG is my hackathon-winning conversational AI project! 🏆 It uses retrieval-augmented generation to create more accurate and contextual AI responses. The judges praised it as the 'most practical AI application' at the competition. I built it using RAG architecture, NLP techniques, Python, and Streamlit.",
        timestamp,
        links: [
          { text: 'View on GitHub', url: 'https://github.com/sambett/neurorag', type: 'github' }
        ],
        suggestions: ['Tell me about other AI projects', 'What technologies do you use?', 'How did you build the RAG system?']
      };
    }
    
    if (message.includes('docconnect') || message.includes('housing')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "DocConnect is a student housing platform I built for Tunisia! 🏠 It has helped over 200 students find accommodation by considering local housing customs and family values. I developed it using React, Node.js, and MongoDB, making sure it respects Tunisian cultural context around student living.",
        timestamp,
        suggestions: ['What other projects have you built?', 'How do you consider culture in tech?', 'Tell me about your technical skills']
      };
    }
    
    if (message.includes('helmet') || message.includes('computer vision')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "My Helmet Detection system uses computer vision for safety monitoring with 95% accuracy! 🪖 It's built with Python and OpenCV to automatically detect whether workers are wearing safety helmets. This kind of AI application can really improve workplace safety.",
        timestamp,
        suggestions: ['What other AI projects do you have?', 'How accurate is the detection?', 'What technologies do you use for CV?']
      };
    }
    
    // Skills questions
    if (message.includes('skills') || message.includes('technologies') || message.includes('tech stack')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I work across the full AI development stack! 🚀\n\n**AI & ML**: RAG Systems, Computer Vision, NLP, TensorFlow, PyTorch\n**Frontend**: React, TypeScript, Framer Motion, Tailwind CSS\n**Backend**: Node.js, Express.js, MongoDB, PostgreSQL\n**Languages**: Arabic, French, English, Turkish, Spanish\n\nI love combining technical skills with cultural understanding to build meaningful solutions!",
        timestamp,
        suggestions: ['Tell me about your projects', 'How do you use these skills?', 'What languages do you speak?']
      };
    }
    
    // Experience questions
    if (message.includes('experience') || message.includes('volunteering') || message.includes('countries')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I've had amazing experiences across 4+ countries! 🌍\n\n🇹🇳 **Tunisia**: Home base where I built DocConnect\n🇹🇷 **Turkey**: AIESEC volunteer teaching English to 40+ students\n🇲🇦 **Morocco**: Cultural exchange and skills training\n🇮🇳 **India**: Upcoming AI healthcare project\n\nEach experience teaches me how different cultures approach technology and problem-solving!",
        timestamp,
        suggestions: ['How does culture influence your AI work?', 'Tell me about your projects', 'What did you learn from volunteering?']
      };
    }
    
    // Language questions
    if (message.includes('language') || message.includes('speak')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I speak 5 languages! 🗣️ Arabic and French (native level), English (fluent), Turkish (conversational), and Spanish (learning). This multilingual background really helps me understand how different cultures think about technology and user experience. It's amazing how language shapes the way we approach problem-solving!",
        timestamp,
        suggestions: ['How does this help with AI development?', 'Tell me about your cultural experiences', 'What projects have you built?']
      };
    }
    
    // Culture and AI questions
    if (message.includes('culture') || message.includes('cultural') || message.includes('global')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Culture deeply influences how I approach AI! 🌍 Each country I've worked in has taught me that technology is never culturally neutral. For example, in Tunisia I learned to design DocConnect considering family values in housing. In Turkey, I saw how different communication styles affect language learning AI. I believe the best AI solutions emerge when we combine diverse cultural perspectives!",
        timestamp,
        suggestions: ['Tell me about specific cultural insights', 'How do you apply this to projects?', 'What countries have you worked in?']
      };
    }
    
    // Contact questions
    if (message.includes('contact') || message.includes('hire') || message.includes('work') || message.includes('collaborate')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'd love to connect! 💫 You can reach me through:\n\n📧 **Email**: Check the contact section for direct email\n💼 **LinkedIn**: Connect for professional discussions\n🐱 **GitHub**: Explore my code and projects\n📅 **Meeting**: Schedule a call to discuss opportunities\n\nI'm always excited to work on AI projects that make a real difference!",
        timestamp,
        links: [
          { text: 'GitHub Profile', url: 'https://github.com/sambett', type: 'github' },
          { text: 'LinkedIn', url: 'https://linkedin.com/in/selma-bettaieb', type: 'external' }
        ],
        suggestions: ['Tell me about your availability', 'What kind of projects interest you?', 'Show me your portfolio']
      };
    }
    
    // Default responses
    const defaultResponses = [
      {
        content: "Hi! 👋 I'm Selma's AI assistant. I can tell you about her projects, skills, experiences across different countries, or help you get in touch. What would you like to know?",
        suggestions: ['Tell me about her AI projects', 'What skills does she have?', 'How can I contact her?', 'What countries has she worked in?']
      },
      {
        content: "I'd be happy to help you learn more about Selma! She's passionate about building AI solutions that bridge cultures and create real impact. What specific area interests you?",
        suggestions: ['Her technical skills', 'International experience', 'Recent projects', 'Cultural approach to AI']
      },
      {
        content: "Great question! Selma combines technical AI expertise with global cultural insights from her work across Tunisia, Turkey, Morocco, and upcoming projects in India. What aspect would you like to explore?",
        suggestions: ['NeuroRAG AI project', 'DocConnect platform', 'Computer vision work', 'Cross-cultural AI philosophy']
      }
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp,
      suggestions: randomResponse.suggestions
    };
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: "Hello! 👋 I'm Selma's AI assistant. I can help you learn about her AI projects, technical skills, global experiences, and how to get in touch. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        'Tell me about her AI projects',
        'What programming skills does she have?',
        'How can I contact her?',
        'What countries has she worked in?'
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = getResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 0px rgba(147, 51, 234, 0.4)',
            '0 0 20px rgba(147, 51, 234, 0.4)',
            '0 0 0px rgba(147, 51, 234, 0.4)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Notification Pulse */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-2 h-2 text-white" />
        </motion.div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-full max-w-md h-[600px] bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Selma's AI Assistant</h3>
                    <p className="text-xs text-gray-400">Ask me anything about her work!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-cyan-500' 
                          : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`rounded-2xl p-3 ${
                        message.type === 'user' 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white/10 text-gray-100 border border-white/10'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        
                        {/* Links */}
                        {message.links && (
                          <div className="mt-3 space-y-2">
                            {message.links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-xs bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
                              >
                                {link.type === 'github' ? (
                                  <Github className="w-3 h-3" />
                                ) : (
                                  <ExternalLink className="w-3 h-3" />
                                )}
                                <span>{link.text}</span>
                              </a>
                            ))}
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-white/5 hover:bg-white/15 rounded-lg p-2 transition-colors border border-white/10"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about her projects, skills, or experience..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};