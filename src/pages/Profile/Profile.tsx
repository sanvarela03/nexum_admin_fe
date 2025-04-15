import { NavigateFunction, useNavigate } from 'react-router-dom'
import tokenService from '../../services/token.service'
import AuthService from '../../services/auth.service'

export default function Profile() {
  const navigate: NavigateFunction = useNavigate()
  const user = tokenService.getUser()

  console.log(user)

  const handleClick = async () => {
    const message = await AuthService.logout()
    console.log(message)
    navigate('/login')
  }

  return (
    <>
      <div>
        <p>
          Bienvenido{' '}
          <span style={{ fontWeight: 'bold' }}>{user?.username}</span>
          <button onClick={handleClick}>Click Me</button>
        </p>
      </div>
    </>
  )
}
