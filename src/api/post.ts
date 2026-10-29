import {PostRequestRO, PostUpdateRO} from "@/model/request"
import {PageVO, PostDetailVO, PostPreviewVO} from "@/model/response"
import {PostStatusEnum} from "@/model/enum"
import {http} from "@/common.ts"


export const getAllPost = (pageIndex: number, pageSize: number, status: PostStatusEnum) => {
    const postRequest: PostRequestRO = {
        page_index: pageIndex,
        page_size: pageSize,
        status: status
    }
    return http.post<PageVO<PostPreviewVO>>('/post/all', postRequest)
}

export const createPostAPI = () => {
    return http.post<PostDetailVO>('/post/create')
}

// Returns null for an id that no longer exists
export const getPostDetailAPI = (postId: string | number) => {
    return http.get<PostDetailVO | null>(`/post/detail/${postId}`)
}

export const updatePostDetailAPI = (postUpdateRO: PostUpdateRO) => {
    return http.post<PostDetailVO>('/post/update', postUpdateRO)
}

export const updatePostStatusDetailAPI = (postId: number, postStatusEnum: PostStatusEnum) => {
    return http.postVoid(`/post/status/${postId}`, {status: postStatusEnum})
}

export const deletePostAPI = (postId: string | number) => {
    return http.deleteVoid(`/post/delete/${postId}`)
}
