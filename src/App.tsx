import './output.css'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import './App.css'
import AppNavbar from '@components/AppNavbar'
import AppRoutes from '@routes/AppRoutes'
import { useNavigate, useHref } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider />
      <div className="h-screen flex flex-col">
        <div className="sticky top-0 z-50">
          <AppNavbar />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AppRoutes />
        </div>
      </div>
    </HeroUIProvider>
  )
}

export default App
