import axios, {AxiosResponse} from "axios"
import {FileUploadVO} from "../model/response"
import {LoginRO} from "../model/request.ts";

axios.defaults.baseURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL
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
