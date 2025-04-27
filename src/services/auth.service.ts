import api from '../api/axios'
import TokenService from './token.service'

interface RegisterRequest {
  username: string
  password: string
  email: string
  name: string
  lastName: string
  phone: string
  roles: string[]
}

class AuthService {
  async login(username: string, password: string) {
    const response = await api.post('auth/signin', { username, password })
    if (response.data.token) {
      TokenService.setUser(response.data)
    }
    return response.data
  }

  async logout() {
    return api.post('auth/signout').then((response) => {
      if (response.data) {
        TokenService.removeUser()
      }
      return response.data.message
    })
  }

  register(data: RegisterRequest | FormData) {
    const isFormData = data instanceof FormData

    return api.post('auth/signup', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    })
  }

  getCurrentUser() {
    return TokenService.getUser()
  }
}

export default new AuthService()
