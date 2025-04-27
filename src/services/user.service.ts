import api from '../api/axios'

class UserService {
  async getUsers() {
    return api.get('users')
  }
}

export default new UserService()
