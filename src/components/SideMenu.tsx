import { TokenService } from '@services'
import { NavLink } from 'react-router-dom'

type MenuItem = {
  label: string
  path: string
  roles?: string[]
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Perfil', path: '/profile', roles: ['ROLE_ADMIN'] },
  { label: 'Usuarios', path: '/users', roles: ['ROLE_ADMIN'] },
  { label: 'Mapa', path: '/map', roles: ['ROLE_ADMIN'] },
]

const SideMenu = () => {
  const user = TokenService.getUser()

  const hasRole = (roles?: string[]) => {
    if (!roles) return true
    return roles.some(role => user?.roles?.includes(role))
  }

  return (
    <div className="h-full p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>

      {menuItems
        .filter(item => hasRole(item.roles))
        .map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `
            }
          >
            {item.label}
          </NavLink>
        ))}
    </div>
  )
}

export default SideMenu