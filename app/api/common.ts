import axios, {AxiosResponse} from "axios"
import {FileUploadVO} from "@/app/model/response"

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

export const uploadFileAPI = async (formData: FormData) => {
    return await axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res: AxiosResponse<FileUploadVO>) => res.data)
}

