import './output.css'
import { HeroUIProvider } from '@heroui/react'
import './App.css'
import AppNavbar from './components/AppNavbar'
import AppRoutes from './routes/AppRoutes'
import { useNavigate, useHref } from 'react-router-dom'
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
