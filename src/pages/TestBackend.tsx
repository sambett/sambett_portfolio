import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'

export const TestBackend = () => {
  const [tests, setTests] = useState({
    health: { status: 'pending', message: '' },
    projects: { status: 'pending', message: '' },
    experiences: { status: 'pending', message: '' },
    adminAuth: { status: 'pending', message: '' }
  })

  const [overallStatus, setOverallStatus] = useState('testing')

  useEffect(() => {
    runAllTests()
  }, [])

  const runAllTests = async () => {
    console.log('🧪 Starting backend connectivity tests...')
    
    // Test 1: Health Check
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setTests(prev => ({
        ...prev,
        health: { 
          status: 'success', 
          message: `Backend running on port ${data.port}` 
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        health: { 
          status: 'error', 
          message: 'Backend not responding - check if it\'s running' 
        }
      }))
    }

    // Test 2: Projects API
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setTests(prev => ({
        ...prev,
        projects: { 
          status: 'success', 
          message: `Found ${data.projects?.length || 0} projects` 
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        projects: { 
          status: 'error', 
          message: 'Projects API failed' 
        }
      }))
    }

    // Test 3: Experiences API
    try {
      const response = await fetch('/api/experiences')
      const data = await response.json()
      setTests(prev => ({
        ...prev,
        experiences: { 
          status: 'success', 
          message: `Found ${data.experiences?.length || 0} experiences` 
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        experiences: { 
          status: 'error', 
          message: 'Experiences API failed' 
        }
      }))
    }

    // Test 4: Admin Authentication
    try {
      const response = await fetch('/admin/status')
      if (response.status === 401) {
        setTests(prev => ({
          ...prev,
          adminAuth: { 
            status: 'success', 
            message: 'Admin auth working (not logged in)' 
          }
        }))
      } else {
        const data = await response.json()
        setTests(prev => ({
          ...prev,
          adminAuth: { 
            status: 'success', 
            message: data.authenticated ? 'Logged in as admin' : 'Admin auth ready' 
          }
        }))
      }
    } catch (error) {
      setTests(prev => ({
        ...prev,
        adminAuth: { 
          status: 'error', 
          message: 'Admin auth failed' 
        }
      }))
    }

    // Determine overall status
    setTimeout(() => {
      setOverallStatus('complete')
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'error':
        return <XCircle className="text-red-500" size={20} />
      case 'pending':
        return <Loader className="text-blue-500 animate-spin" size={20} />
      default:
        return <AlertCircle className="text-yellow-500" size={20} />
    }
  }

  const allTestsPassed = Object.values(tests).every(test => test.status === 'success')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Backend Connectivity Test
          </h1>
          <p className="text-slate-300">
            Testing all backend endpoints and functionality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(tests).map(([testName, result], index) => (
            <motion.div
              key={testName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800 capitalize">
                  {testName.replace(/([A-Z])/g, ' $1')} Test
                </h3>
                {getStatusIcon(result.status)}
              </div>
              <p className="text-slate-600 text-sm">
                {result.message || 'Running test...'}
              </p>
            </motion.div>
          ))}
        </div>

        {overallStatus === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-6 rounded-xl text-center ${
              allTestsPassed 
                ? 'bg-green-100 border border-green-200' 
                : 'bg-red-100 border border-red-200'
            }`}
          >
            <div className="text-2xl mb-2">
              {allTestsPassed ? '✅' : '❌'}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${
              allTestsPassed ? 'text-green-800' : 'text-red-800'
            }`}>
              {allTestsPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
            </h2>
            <p className={`${
              allTestsPassed ? 'text-green-700' : 'text-red-700'
            }`}>
              {allTestsPassed 
                ? 'Your backend is working perfectly. Admin dashboard should work now!'
                : 'Please check the backend server and try again.'
              }
            </p>
            
            {allTestsPassed && (
              <div className="mt-4 space-x-4">
                <a
                  href="/admin/login"
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Go to Admin Login
                </a>
                <a
                  href="/"
                  className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Portfolio
                </a>
              </div>
            )}
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={runAllTests}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            🔄 Run Tests Again
          </button>
        </div>
      </div>
    </div>
  )
}
