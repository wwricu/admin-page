import axios, {AxiosResponse} from "axios"
import {FileUploadVO} from "@/app/model/response"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL
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
