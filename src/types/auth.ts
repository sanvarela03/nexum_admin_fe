export interface AuthResponse {
    id: number
    username: string
    email: string
    token: string
    refreshToken: string
    type: string
    roles: string[]
}

export interface RefreshResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
}