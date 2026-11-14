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

export const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!').then()
    }
    return isJpgOrPng
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
        if (errorMsg !== 'Please input TOTP') message.error(errorMsg).then()

        if (response.status === 401 && !window.location.pathname.startsWith('/login')) {
            const {router} = await import('@/App')
            await router.navigate('/login')
        }

        throw new HttpError(errorMsg, response.status)
    }

    if (expectBody && data === undefined) {
        const errorMsg = 'Empty response from server'
        message.error(errorMsg).then()
        throw new HttpError(errorMsg, response.status)
    }

    return data as T
}

const acceptJson = {'Accept': 'application/json'}

const postInit = (data: unknown): RequestInit => data instanceof FormData
    ? {method: 'POST', body: data}
    : {method: 'POST', headers: {'Content-Type': 'application/json', ...acceptJson}, body: JSON.stringify(data)}

export const http = {
    get<T>(url: string) { return send<T>(url, {method: 'GET', headers: acceptJson}, true) },
    post<T>(url: string, data?: unknown) { return send<T>(url, postInit(data), true) },
    postVoid(url: string, data?: unknown) { return send<void>(url, postInit(data), false) },
    deleteVoid(url: string) { return send<void>(url, {method: 'DELETE', headers: acceptJson}, false) }
}
