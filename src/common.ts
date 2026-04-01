import {createContext, useContext} from "react"
import axios from "axios"
import {message} from "antd"

export const RefreshContext = createContext<{ key: boolean, triggerRefresh: () => void } | null>(null)

export const useRefresh = () => {
    // Get context in element wrapped by RefreshProvider who give context
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within RefreshProvider');
    }
    return context
}

export const baseUrl = import.meta.env.VITE_BASE_URL ?? '/api'

export const myAxios = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    withCredentials: true,
    headers: {
        post: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
})

myAxios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const { response } = error

        if (response?.status === 401 && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login'
            return Promise.reject(error)
        }

        if (response && response.status !== 200 && response.data?.detail) {
            message.error(response.data?.detail).then()
        } else {
            message.error(error.message).then()
        }
        return Promise.reject(error)
    }
)
