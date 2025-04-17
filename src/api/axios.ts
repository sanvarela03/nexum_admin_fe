import axios from 'axios'
import TokenService from '../services/token.service'

const api = axios.create({
  baseURL: await import.meta.env.VITE_API_BASE_URL,
  headers: {
  },
})

const requestLimiter = new Map<string, { count: number; timestamp: number }>()

const MAX_REQUESTS = 5 // Máximo de solicitudes permitidas por endpoint
const TIME_WINDOW = 5000 // Tiempo de espera en milisegundos (5 segundos)

api.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 📌 Control de límite de solicitudes
    const url = config.url || ''
    const now = Date.now()

    if (requestLimiter.has(url)) {
      const requestData = requestLimiter.get(url)!

      // Reiniciar el contador si ha pasado el tiempo límite
      if (now - requestData.timestamp > TIME_WINDOW) {
        requestLimiter.set(url, { count: 1, timestamp: now })
      } else {
        if (requestData.count >= MAX_REQUESTS) {
          return Promise.reject(
            new Error(`Demasiadas solicitudes a ${url}. Espera unos segundos.`)
          )
        }
        requestData.count++
      }
    } else {
      requestLimiter.set(url, { count: 1, timestamp: now })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config

    if (
      (originalConfig?.url || '') !== 'auth/signin'
      && (originalConfig?.url || '') !== 'auth/signup'
      && error.response
      && TokenService.getLocalAccessToken()) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          const rs = await api.post('/auth/refreshtoken', {
            refreshToken: TokenService.getLocalRefreshToken(),
          })
          TokenService.updateLocalAccessToken(rs.data.accessToken)
          return api(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
