import {createContext, useContext} from "react"
import {message} from "antd"

export const RefreshContext = createContext<{ key: boolean, triggerRefresh: () => void } | null>(null)

export const useRefresh = () => {
    // Get context in element wrapped by RefreshProvider who give context
    const context = useContext(RefreshContext)
    if (!context) {
        throw new Error('useRefresh must be used within RefreshProvider')
    }
    return context
}

export class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const readBody = async (response: Response): Promise<unknown> => {
    const text = await response.text()
    if (!text) {
        return undefined
    }
    try {
        return JSON.parse(text)
    } catch {
        return undefined
    }
}

// FastAPI answers a bad request with `detail` as a string, but a pydantic validation error
// makes it an array of errors; rendering that array would break the toast.
const detailText = (detail: unknown): string => {
    if (typeof detail === 'string') {
        return detail
    }
    if (Array.isArray(detail)) {
        return detail.map((item) => item?.msg).filter(Boolean).join('; ')
    }
    return ''
}

const send = async <T>(url: string, init: RequestInit, expectBody: boolean): Promise<T> => {
    const response = await fetch(`/api${url}`, init)
    const data = await readBody(response)

    if (!response.ok) {
        const errorMsg = detailText((data as { detail?: unknown } | undefined)?.detail) || response.statusText
        message.error(errorMsg).then()

        if (response.status === 401 && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login'
        }

        // Always reject so callers can settle loading state in their catch/finally branches
        throw new HttpError(errorMsg, response.status)
    }

    // A 200 without a body is how a failed lookup comes back. Handing it to the caller would turn
    // "not found" into an empty record, so endpoints that really return nothing use the void calls.
    if (expectBody && data === undefined) {
        const errorMsg = 'Empty response from server'
        message.error(errorMsg).then()
        throw new HttpError(errorMsg, response.status)
    }

    return data as T
}

const withAccept = (headers?: Record<string, string>) => ({'Accept': 'application/json', ...headers})

const postInit = (data: unknown, headers?: Record<string, string>): RequestInit => {
    const isFormData = data instanceof FormData
    return {
        method: 'POST',
        headers: isFormData ? headers : {'Content-Type': 'application/json', ...withAccept(headers)},
        body: isFormData ? data : JSON.stringify(data)
    }
}

export const http = {
    get<T>(url: string, headers?: Record<string, string>): Promise<T> {
        return send<T>(url, {method: 'GET', headers: withAccept(headers)}, true)
    },

    post<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
        return send<T>(url, postInit(data, headers), true)
    },

    // For endpoints whose response body carries nothing the app needs
    postVoid(url: string, data?: unknown, headers?: Record<string, string>): Promise<void> {
        return send<void>(url, postInit(data, headers), false)
    },

    deleteVoid(url: string, headers?: Record<string, string>): Promise<void> {
        return send<void>(url, {method: 'DELETE', headers: withAccept(headers)}, false)
    }
}
