import tokenService from '../../services/token.service'
import userService from '../../services/user.service'
import './profile.css'
import { useEffect, useState } from 'react'
import { UserResponse } from '../../types/user';
import AppTable from '../../components/AppTable'

export default function Profile() {
  const user = tokenService.getUser()

  const [users, setUsers] = useState<UserResponse[]>([])

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
    </div>
  )
}
