import api from '../api/axios';

class UserService {
  async getUsers() {
    const response = await api.get('users')
    return response
  }
}

export default new UserService();
