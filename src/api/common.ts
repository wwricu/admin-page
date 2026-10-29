import {FileUploadVO} from "@/model/response"
import {LoginRO} from "@/model/request.ts"
import {http} from "@/common.ts"


export const uploadFileAPI = (formData: FormData) => {
    return http.post<FileUploadVO>('/post/upload', formData)
}

export const loginAPI = (loginRO: LoginRO) => {
    return http.postVoid('/login', loginRO)
}

export const logoutAPI = () => {
    return http.get<null>('/logout')
}

export const infoAPI = () => {
    return http.get<null>('/info')
}
