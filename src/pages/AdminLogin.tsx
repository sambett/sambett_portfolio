import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, Shield, AlertCircle, CheckCircle, Server, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { isBackendAvailable } from '../utils/api'

export const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  
  const { login } = useAuth()

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = () => {
      if (isBackendAvailable()) {
        setBackendStatus('available')
      } else {
        setBackendStatus('unavailable')
        setError('Admin features are only available in development mode. This portfolio works perfectly as a static site without a backend!')
      }
    }

    // Small delay to show checking state
    setTimeout(checkBackend, 500)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (backendStatus === 'unavailable') {
      // Redirect to portfolio if backend is not available
      window.location.href = '/'
      return
    }
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await login(formData.username, formData.password)
      // Redirect will be handled by the auth hook
    } catch (error: any) {
      setError(error.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-md w-full space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <Shield size={48} className="text-primary-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-slate-300">
            Secure login to manage your portfolio content
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3"
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || backendStatus !== 'available'}
              whileHover={{ scale: (isLoading || backendStatus !== 'available') ? 1 : 1.02 }}
              whileTap={{ scale: (isLoading || backendStatus !== 'available') ? 1 : 0.98 }}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                isLoading || backendStatus !== 'available'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
                  <span>Signing in...</span>
                </>
              ) : backendStatus === 'unavailable' ? (
                <>
                  <Home size={18} />
                  <span>Return to Portfolio</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Access Dashboard</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-slate-700"
          >
            <div className="flex items-start space-x-3 text-slate-400">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-400" />
              <div className="text-sm">
                <p className="font-medium text-slate-300 mb-1">Secure Access</p>
                <p>This area is protected with JWT authentication and requires valid admin credentials.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Portfolio Link */}
        <motion.div variants={itemVariants} className="text-center">
          <a
            href="/"
            className="text-slate-400 hover:text-primary-400 transition-colors text-sm inline-flex items-center space-x-2"
          >
            <span>← Back to Portfolio</span>
          </a>
        </motion.div>

        {/* Backend Status Notice */}
        {backendStatus === 'checking' && (
          <motion.div 
            variants={itemVariants}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <Server size={16} className="mt-0.5 flex-shrink-0 text-blue-400 animate-pulse" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Checking Backend Status</p>
                <p>Verifying admin features availability...</p>
              </div>
            </div>
          </motion.div>
        )}

        {backendStatus === 'unavailable' && (
          <motion.div 
            variants={itemVariants}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-400" />
              <div className="text-sm text-green-300">
                <p className="font-medium mb-1">Static Portfolio Mode</p>
                <p>This portfolio is running perfectly as a static site! Admin features are only available during local development.</p>
                <div className="mt-3 flex items-center space-x-2">
                  <Home size={14} />
                  <a href="/" className="text-green-400 hover:text-green-300 transition-colors font-medium">← Back to Portfolio</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {backendStatus === 'available' && (
          <motion.div 
            variants={itemVariants}
            className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-400" />
              <div className="text-sm text-amber-300">
                <p className="font-medium mb-1">Development Environment</p>
                <p>Admin features are available. Demo credentials:</p>
                <div className="mt-2 font-mono text-xs bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div>Username: admin</div>
                  <div>Password: selma2024</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}