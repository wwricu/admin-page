import {createContext, useContext} from "react"
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

type RequestOptions = {
    headers?: Record<string, string>
}

export class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401 && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
        throw new HttpError('Unauthorized', 401)
    }

    if (!response.ok) {
        const data = await response.json().catch(() => null)
        const errorMsg = data?.detail || response.statusText
        if (response.status !== 422) {
            message.error(errorMsg).then()
        }
        throw new HttpError(errorMsg, response.status)
    }

    const text = await response.text()
    return text ? JSON.parse(text) : null
}

export const http = {
    async get<T>(url: string, options?: RequestOptions): Promise<T> {
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                ...options?.headers
            }
        })
        return handleResponse<T>(response)
    },

    async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const isFormData = data instanceof FormData
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'POST',
            credentials: 'include',
            headers: isFormData ? options?.headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers
            },
            body: isFormData ? data : JSON.stringify(data)
        })
        return handleResponse<T>(response)
    }
}
