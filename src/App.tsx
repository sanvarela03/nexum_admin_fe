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

/*fetch('./assets/Captura de pantalla 2025-04-12 204604.png') // adjust path accordingly
    .then((res) => res.blob())
    .then((blob) => {
      const data = {
        username: "admin2000121212",
        email: "abc1231@mailsasax.com",
        password: "string",
        name: "string",
        lastName: "string",
        firebaseToken: "string",
        roles: "ROLE_USER, ROLE_ADMIN",
      };

      const formData = new FormData();

      (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Use 'key' directly or `${key}[]` depending on backend
        } else {
          formData.append(key, value);
        }
      });

      AuthService.register(formData);
  });*/