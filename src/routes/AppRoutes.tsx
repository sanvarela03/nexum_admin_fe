import { Route, Routes } from 'react-router-dom'
import AppLayout from './../AppLayout'
import Home from '../pages/Home/Home'
import Signup from '../pages/Signup/Signup'
import Login from '../pages/Login/Login'
import Profile from '../pages/Profile/Profile'
import Users from '../pages/Users/Users'
import MapView from '../pages/MapView/MapView'
import Secure from '../pages/ProtectedRoute'
import { useState } from 'react'

function AppRoutes() {
  const [selectPosition, setSelectPosition] = useState(null);
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<p>About</p>} />
        <Route path="/contact" element={<p>Contact</p>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={<Secure element={<Profile />} roles={['ROLE_ADMIN']} />}
        />
        <Route
          path="/users"
          element={<Secure element={<Users />} roles={['ROLE_ADMIN']} />}
        />
        <Route
          path="/map"
          element={<Secure element={<MapView selectPosition={selectPosition} setSelectPosition={setSelectPosition} />} roles={['ROLE_ADMIN']} />}
        />

        <Route path="*" element={<p>404 Not Found</p>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes