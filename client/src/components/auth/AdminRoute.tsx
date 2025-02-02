import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/auth'
import { UserRole } from '@/types'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userRole = useAuthStore((state) => state.user?.role)

  if (!isAuthenticated || userRole !== UserRole.ADMIN) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute 