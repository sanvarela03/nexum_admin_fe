import { Route, Routes } from 'react-router'
import Home from '../pages/Home/Home'
import Signup from '../pages/Signup/Signup'
import Login from '../pages/Login/Login'
import Profile from '../pages/Profile/Profile'
import Secure from '../pages/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<p>About</p>} />
      <Route path="/contact" element={<p>Contact</p>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Secure element={<Profile />} />} />
      <Route path="*" element={<p>404 Not Found</p>} />
    </Routes>
  )
}

export default AppRoutes
