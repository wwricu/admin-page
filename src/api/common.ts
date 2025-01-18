import axios, {AxiosResponse} from "axios"
import {FileUploadVO} from "../model/response"
import {LoginRO} from "../model/request.ts";
import {DatabaseActionEnum} from "../model/enum.ts";

export const baseUrl = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

export const myAxios = axios


export const uploadFileAPI = async (formData: FormData) => {
    return await myAxios.post('/post/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res: AxiosResponse<FileUploadVO>) => res.data)
}

export const loginAPI = async (loginRO: LoginRO) => {
    return await myAxios.post('/login', loginRO)
}

export const infoAPI = async () => {
    return await myAxios.get('/info').then((res: AxiosResponse<boolean>) => res.data)
}

export const databaseAPI = async (action: DatabaseActionEnum) => {
    return await myAxios.get(`/database?action=${action}`).then((res: AxiosResponse<null>) => res.data)
}
