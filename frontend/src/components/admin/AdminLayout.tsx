import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

export const AdminLayout = ({ children, title = 'Admin Dashboard' }: AdminLayoutProps) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 mt-2">Welcome back, {user?.username}</p>
        </div>
        {children}
      </motion.div>
    </div>
  )
}