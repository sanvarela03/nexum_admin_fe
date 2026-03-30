import './output.css'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import './App.css'
import AppRoutes from '@routes/AppRoutes'
import { useNavigate, useHref } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />
      <AppRoutes />
    </HeroUIProvider>
  )
}

export default App
