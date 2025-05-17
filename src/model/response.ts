import {EntityTypeEnum, PostStatusEnum} from "./enum.ts";

export interface TagVO {
    id: number
    name: string
    type: string
    count: number
}

export interface PostResourceVO {
    id: number,
    name?: string
    key: string
    url: string
}

export interface PostDetailVO {
    id: number
    title: string
    cover?: PostResourceVO
    content: string
    preview: string
    tag_list: TagVO[]
    category?: TagVO
    status: string
    create_time: string
    update_time: string
}

export interface PostDetailPageVO {
    page_index: number
    page_size: number
    count: number
    data: PostDetailVO[]
}

export interface TagVO {
    id: number
    name: string
    type: string
}

export interface FileUploadVO {
    name: string
    location: string
}

export interface TrashBinVO {
    id: number
    name: string
    type: EntityTypeEnum
    status?: PostStatusEnum
    delete_time: string
}
