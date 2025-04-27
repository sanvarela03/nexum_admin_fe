import { NavigateFunction, useNavigate } from 'react-router-dom'
import tokenService from '../../services/token.service'
import AuthService from '../../services/auth.service'
import userService from '../../services/user.service'
import './profile.css'
import { useEffect, useState } from 'react'
import { UserResponse } from '../../types/user'
import AppTable from '../../components/AppTable'

export default function Profile() {
  const navigate: NavigateFunction = useNavigate()
  const user = tokenService.getUser()

  const [users, setUsers] = useState<UserResponse[]>([])

  const handleClick = async () => {
    await AuthService.logout()
    navigate('/login')
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers()
        setUsers(response.data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="profile-container">
      {/* <div>
        <p>{users ? JSON.stringify(users) : 'No users available'}</p>
      </div> */}
      <div>
        <AppTable userList={users || []} />
      </div>
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
          <span className="profile-roles-title">Roles:</span>
          <div className="profile-roles-list">
            <ul className="profile-roles-ul-list">
              {user?.roles.map((role: string) => (
                <li key={role}>
                  <span className="profile-roles-pill">{role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button onClick={handleClick} className="profile-logout-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
