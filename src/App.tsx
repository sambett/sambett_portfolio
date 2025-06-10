import { Routes, Route } from 'react-router-dom'
import { Portfolio } from './pages/Portfolio'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { TestBackend } from './pages/TestBackend'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/test-backend" element={<TestBackend />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </div>
  )
}

export default App