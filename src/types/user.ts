export interface UserResponse {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  verificationCode?: number
  verificationCodeTimestamp?: string
  firebaseToken: string
  phone?: string
  dateJoined: string
  lastLogin: string
  imgUrl?: string
  enabled: boolean
}