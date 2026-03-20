import {AxiosResponse} from "axios"
import {FileUploadVO} from "../model/response"
import {LoginRO} from "../model/request.ts"
import {myAxios} from "../common.ts"


export const uploadFileAPI = async (formData: FormData) => {
    return await myAxios.post('/post/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res: AxiosResponse<FileUploadVO>) => res.data)
}

export const loginAPI = async (loginRO: LoginRO) => {
    return await myAxios.post('/login', loginRO).then(() => {})
}

export const logoutAPI = async () => {
    return await myAxios.get('/logout').then(() => {})
}

export const infoAPI = async () => {
    return await myAxios.get('/info')
}
