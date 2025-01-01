import {AxiosResponse} from "axios"
import {PostRequestRO, PostUpdateRO} from "../model/request"
import {PostDetailVO} from "../model/response"
import {PostStatusEnum} from "../model/enum";
import {myAxios} from "./common.ts";


export const getAllPost = async (pageIndex: number, pageSize: number, status: PostStatusEnum) => {
    const postRequest: PostRequestRO = {
        page_index: pageIndex,
        page_size: pageSize,
        status: status
    }
    return await myAxios.post('/post/all', postRequest).then((res: AxiosResponse<PostDetailVO[]>) => res.data)
}

export const createPostAPI = async () => {
    return await myAxios.get('/post/create').then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const getPostDetailAPI = async (postId: string | number) => {
    return await myAxios.get(`/post/detail/${postId}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const updatePostDetailAPI = async (postUpdateRO: PostUpdateRO) => {
    return await myAxios.post('/post/update', postUpdateRO)
        .then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const updatePostStatusDetailAPI = async (postId: number, postStatusEnum: PostStatusEnum) => {
    return await myAxios.post(`/post/status/${postId}?post_status=${postStatusEnum}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}

export const deletePostAPI = async (postId: string | number) => {
    return await myAxios.get(`/post/delete/${postId}`).then((res: AxiosResponse<PostDetailVO>) => res.data)
}
