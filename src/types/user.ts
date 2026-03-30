export interface Session {
  token: string
  deviceName: string
  sessionExpiryDate: string
  sessionCreatedAt: string
}

export interface UserResponse {
  userId: number
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
  isEnabled: boolean
  roles: string[],
  sessions: Session[]
}

export interface UserEdit {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  password: string
}
