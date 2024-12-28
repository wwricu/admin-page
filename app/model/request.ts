import {TagTypeEnum} from "@/app/model/enum";

export interface PostRequestRO {
    page_index: number
    page_size: number
    tag_list?: string[]
    cat_id?: string| undefined
    status?: string | undefined
    deleted?: boolean | undefined
}

export interface PostUpdateRO {
    id: number
    title?: string
    cover?: string
    content?: string
    tag_id_list?: number[]
    category_id?: number
    status?: string
}

export interface TagRO {
    id?: number
    name: string
    type: string
}

export interface TagBatchRO {
    id_list: number[]
    type: TagTypeEnum
}

export interface GetTagRO {
    page_size?: number
    page_index?: number
    type: TagTypeEnum
}
