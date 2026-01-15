import './output.css'
import { HeroUIProvider } from '@heroui/react'
import './App.css'
import AppNavbar from './components/AppNavbar'
import AppRoutes from './routes/AppRoutes'
import { useNavigate, useHref } from 'react-router-dom'
import Test3D from './components/3D/Test3D'

function App() {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <div className="h-screen flex flex-col">
        <div className="sticky top-0 z-50">
          <AppNavbar />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AppRoutes />
        </div>
      </div>
    </HeroUIProvider>
    // <Test3D />
  )
}

export default App
