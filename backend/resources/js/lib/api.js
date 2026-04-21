import axios from 'axios'
import { clearAuthSession, getAuthToken } from '@/lib/auth'

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            clearAuthSession()
        }

        return Promise.reject(error)
    }
)

export default api
