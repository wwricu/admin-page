import {EntityTypeEnum, PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "@/model/enum.ts"

export interface TagVO {
    id: number
    name: string
    type: TagTypeEnum
    count: number
}

export interface PostResourceVO {
    id: number
    name: string | null
    key: string
    url: string
    type: PostResourceTypeEnum
}

export interface PostPreviewVO {
    id: number
    title: string
    cover: PostResourceVO | null
    preview: string
    tag_list: TagVO[]
    category: TagVO | null
    status: PostStatusEnum | null
    create_time: string
    update_time: string
}

export interface PostDetailVO extends PostPreviewVO {
    content: string
}

export interface PageVO<T> {
    page_index: number
    page_size: number
    count: number
    data: T[]
}

export interface FileUploadVO {
    id: number
    name: string | null
    key: string
    location: string
}

export interface TrashBinVO {
    id: number
    name: string
    info: string | null
    type: EntityTypeEnum
    delete_time: string
}
