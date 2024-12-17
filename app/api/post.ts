import axios, {AxiosResponse} from "axios";
import {PostCreateRO, PostRequestRO, PostUpdateRO} from "@/app/model/request";
import {PostDetailVO} from "@/app/model/response";

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true

export const getAllPost = async (pageIndex: number, pageSize: number) => {
    const postRequest: PostRequestRO = {
        page_index: pageIndex,
        page_size: pageSize
    }
    return await axios.post('/post/all', postRequest).then((res: AxiosResponse<PostDetailVO[]>) => res.data);
}

export const createPostAPI = async (postCreateRO: PostCreateRO) => {
    return await axios.post('/post/create', postCreateRO).then((res: AxiosResponse<PostDetailVO>) => res.data);
}

export const getPostDetailAPI = async (postId: string | number) => {
    return await axios.get(`/post/detail/${postId}`).then((res: AxiosResponse<PostDetailVO>) => res.data);
}

export const updatePostDetailAPI = async (postUpdateRO: PostUpdateRO) => {
    return await axios.post('/post/update', postUpdateRO)
        .then((res: AxiosResponse<PostDetailVO>) => res.data);
}
