import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import { store } from './store'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ComplaintsPage from './pages/ComplaintsPage'
import NotificationsPage from './pages/NotificationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import PrivateRoute from './components/PrivateRoute'
import { ThemeProvider } from './components/ThemeProvider'
import { SmoothScroll } from './components/ui/SmoothScroll'
import CustomCursor from './components/ui/CustomCursor'
import GlobalSparkSystem from './components/ui/GlobalSparkSystem'

function App() {
  const location = useLocation()

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SmoothScroll>
          <CustomCursor />
          <GlobalSparkSystem />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </AnimatePresence>
        </SmoothScroll>
      </ThemeProvider>
    </Provider>
  )
}

export default App
