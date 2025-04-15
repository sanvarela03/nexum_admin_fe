import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './output.css'

import { HeroUIProvider } from '@heroui/react'
import './App.css'
import { Button } from '@heroui/react'
import { p } from 'framer-motion/client'
import SwitchMode from './components/SwitchMode'
import AppNavbar from './components/AppNavbar'
import AppRoutes from './routes/AppRoutes'
import { useNavigate, useHref } from 'react-router-dom'
import AuthService from './services/auth.service'
function App() {
  const navigate = useNavigate()
  return (
    <>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <div className="p-1">
          <AppNavbar />
          <div className="p-4">
            <AppRoutes />
          </div>
        </div>
      </HeroUIProvider>
    </>
  )
}

export default App
