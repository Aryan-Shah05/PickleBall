import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import { theme } from './styles/theme';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import BookCourt from './pages/BookCourt';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { TestRunner } from './tests/components/TestRunner';
import { PageWrapper, AccessibleAnimationWrapper } from './components/animations';
import './styles/globals.css';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <AccessibleAnimationWrapper>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } 
            />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <BookCourt />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <MyBookings />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <TestRunner />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                localStorage.getItem('token') ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </AccessibleAnimationWrapper>
    </ThemeProvider>
  );
}

export default App; 