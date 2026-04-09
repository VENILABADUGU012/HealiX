import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Home from './pages/Home'
import Booking from './pages/Booking'
import BookingDoctorDetail from './pages/BookingDoctorDetail'
import BookingHistory from './pages/BookingHistory'
import RecommendationDetails from './pages/RecommendationDetails'
import AppointmentDetail from './pages/AppointmentDetail'
import Pharmacy from './pages/Pharmacy'
import PharmacyRecommendationDetails from './pages/PharmacyRecommendationDetails'
import PharmacyProductDetail from './pages/PharmacyProductDetail'
import PharmacyOrderDetail from './pages/PharmacyOrderDetail'
import PharmacyOrderHistory from './pages/PharmacyOrderHistory'
import PersonalHealth from './pages/PersonalHealth'
import AIChat from './pages/AIChat'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import AppErrorBoundary from './components/feedback/AppErrorBoundary'

function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/doctor/:id" element={<BookingDoctorDetail />} />
          <Route path="/booking/history" element={<BookingHistory />} />
          <Route path="/booking/recommendations/:slideId" element={<RecommendationDetails />} />
          <Route path="/booking/appointment/:appointmentId" element={<AppointmentDetail />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/pharmacy/recommendations/:slideId" element={<PharmacyRecommendationDetails />} />
          <Route path="/pharmacy/product/:productId" element={<PharmacyProductDetail />} />
          <Route path="/pharmacy/order/:orderId" element={<PharmacyOrderDetail />} />
          <Route path="/pharmacy/history" element={<PharmacyOrderHistory />} />
          <Route path="/personal-health" element={<PersonalHealth />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppErrorBoundary>
  )
}

export default App
