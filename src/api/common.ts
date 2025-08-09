import axios, {AxiosResponse} from "axios"
import {FileUploadVO} from "../model/response"
import {LoginRO} from "../model/request.ts"
import { message } from 'antd'

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
        if (response && response.status !== 200 && response.data?.detail) {
            message.error(response.data?.detail).then()
        } else {
            message.error(error.message).then()
        }
        return Promise.reject(error)
    }
)

export const uploadFileAPI = async (formData: FormData) => {
    return await myAxios.post('/post/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res: AxiosResponse<FileUploadVO>) => res.data)
}

export const loginAPI = async (loginRO: LoginRO) => {
    return await myAxios.post('/login', loginRO).then((_: AxiosResponse<void>) => {})
}

export const logoutAPI = async () => {
    return await myAxios.get('/logout').then((_: AxiosResponse<void>) => {})
}

export const infoAPI = async () => {
    return await myAxios.get('/info').then((res: AxiosResponse<boolean>) => res.data)
}

export const getTotpStatus = async () => {
    return await myAxios.get('/totp').then((res: AxiosResponse<boolean>) => res.data)
}
