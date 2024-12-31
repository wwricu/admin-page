import axios, {AxiosResponse} from "axios"
import {PostRequestRO, PostUpdateRO} from "@/app/model/request"
import {PostDetailVO} from "@/app/model/response"
import {PostStatusEnum} from "@/app/model/enum";

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

export const getAllPost = async (pageIndex: number, pageSize: number, status: PostStatusEnum) => {
    const postRequest: PostRequestRO = {
        page_index: pageIndex,
        page_size: pageSize,
        status: status
    }
    return await axios.post('/post/all', postRequest).then((res: AxiosResponse<PostDetailVO[]>) => res.data)
}

export const createPostAPI = async () => {
    return await axios.get('/post/create').then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const getPostDetailAPI = async (postId: string | number) => {
    return await axios.get(`/post/detail/${postId}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const updatePostDetailAPI = async (postUpdateRO: PostUpdateRO) => {
    return await axios.post('/post/update', postUpdateRO)
        .then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const updatePostStatusDetailAPI = async (postId: number, postStatusEnum: PostStatusEnum) => {
    return await axios.post(`/post/status/${postId}?post_status=${postStatusEnum}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const deletePostAPI = async (postId: string | number) => {
    return await axios.get(`/post/delete/${postId}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}
