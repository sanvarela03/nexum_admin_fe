import api from '../api/axios';
import { UserEdit } from '@app-types/user';

class UserService {
  async getUsers(page: number = 0, size: number = 10, sort: string = 'id,asc') {
    console.log(`Fetching users with page=${page}, size=${size}, sort=${sort}`)
    const response = await api.get('users/sessions', { params: { page, size, sort } })
    return response
  }

  async disableUser(userId: number) {
    const response = await api.put(`users/disable/${userId}`)
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

  async logoutUser(userId: number) {
    const response = await api.put(`users/${userId}/logout`)
    return response
  }
}

export default new UserService();
