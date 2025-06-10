import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isBackendAvailable } from '../../utils/api'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  // Check if backend is available
  useEffect(() => {
    if (!isBackendAvailable()) {
      // If backend is not available, redirect to portfolio
      window.location.href = '/'
    }
  }, [])

  // If backend is not available, show message and redirect
  if (!isBackendAvailable()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 max-w-md">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white mb-4">Portfolio Running Perfectly!</h2>
          <p className="text-slate-300 mb-6">
            This portfolio is working great as a static site. Admin features are only available during local development.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-slate-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}