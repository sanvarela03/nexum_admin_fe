import { NavigateFunction, useNavigate } from 'react-router-dom'
import tokenService from '../../services/token.service'
import AuthService from '../../services/auth.service'
import './profile.css'

export default function Profile() {
  const navigate: NavigateFunction = useNavigate()
  const user = tokenService.getUser()

  const handleClick = async () => {
    await AuthService.logout()
    navigate('/login')
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          Bienvenido, <span className="font-bold">{user?.username}</span>
        </h2>

        <div className="mb-4">
          <p className="profile-email">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
        </div>

        <div className="mb-6">
          <span className="profile-roles-title">
            Roles:
          </span>
          <div className="profile-roles-list">
            <ul className="profile-roles-ul-list">
              {user?.roles.map((role: string) => (
                <li key={role}>
                    <span
                        className="profile-roles-pill"
                    >
                      {role}
                    </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="profile-logout-btn"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
