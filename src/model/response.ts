import {EntityTypeEnum} from "@/model/enum.ts"

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

export interface PostPreviewVO {
    id: number
    title: string
    cover?: PostResourceVO
    preview: string
    tag_list: TagVO[]
    category?: TagVO
    status: string
    create_time: string
    update_time: string
}

export interface PostDetailVO extends PostPreviewVO {
    content: string
}

export interface PostPreviewPageVO {
    page_index: number
    page_size: number
    count: number
    data: PostPreviewVO[]
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
    info?: string
    type: EntityTypeEnum
    delete_time: string
}
