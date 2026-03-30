import AppNavbar from '@components/AppNavbar'
import SideMenu from '@components/SideMenu'
import { TokenService } from '@services'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  const token = TokenService.getLocalAccessToken()

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <AppNavbar />
      </div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar (ONLY if logged in) */}
        {token && (
          <div className="w-64">
            <SideMenu />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppLayout