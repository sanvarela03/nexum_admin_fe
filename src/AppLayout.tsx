import AppNavbar from '@components/AppNavbar'
import SideMenu from '@components/SideMenu'
import { TokenService } from '@services'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  const token = TokenService.getLocalAccessToken()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="sticky top-0 z-50 shrink-0">
        <AppNavbar
          isSidebarOpen={sidebarOpen}
          setSidebarOpen={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {token && (
          <aside
            className={`
              fixed lg:static
              top-16 lg:top-0
              left-0
              z-[1050]
              h-[calc(100vh-4rem)] lg:h-full
              w-40 shrink-0
              bg-background
              transform transition-transform duration-300
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
            `}
          >
            <SideMenu />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile hamburger */}

          <div className="h-full p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout