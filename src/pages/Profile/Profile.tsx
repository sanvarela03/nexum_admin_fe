import { TokenService, UserService }  from '@services'
import './profile.css'
import { useEffect, useState } from 'react'
import { UserResponse } from '@types/user'
import { AppTable } from '@components'

export default function Profile() {
  const user = TokenService.getUser()

  const [users, setUsers] = useState<UserResponse[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers()
        setUsers(response.data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'NOMBRE', uid: 'name' },
    { name: 'USUARIO', uid: 'username' },
    { name: 'ROLES', uid: 'role' },
    { name: 'ESTADO', uid: 'status' },
    { name: 'ULTIMO INGRESO', uid: 'last_login' },
    { name: 'INGRESO', uid: 'date_joined' },
    { name: 'ACCIONES', uid: 'actions' },
  ]

  return (
    <div className="profile-container">
      {/* <div>
        <p>{users ? JSON.stringify(users) : 'No users available'}</p>
      </div> */}
      <div>
        <AppTable userList={users || []} columns={columns} />
      </div>
    </div>
  )
}
