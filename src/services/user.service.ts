import api from '../api/axios';
import { UserEdit } from '@types/user';

class UserService {
  async getUsers() {
    const response = await api.get('users')
    return response
  }

  async disableUser(userId: number) {
    const response = await api.put(`users/${userId}?disable=true`)
    return response
  }

  async editUser(editUserObject: UserEdit) {
    const response = await api.put('users', {
      userId: editUserObject.id,
      username: editUserObject.username,
      firstName: editUserObject.firstName,
      lastName: editUserObject.lastName,
      email: editUserObject.email,
      phone: editUserObject.phone,
      password: editUserObject.password,
    })
    return response
  }
}

export default new UserService();
