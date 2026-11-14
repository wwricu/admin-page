import {EntityTypeEnum, PostStatusEnum, TagTypeEnum} from "@/model/enum.ts"

export interface PageRequestRO {
    page_index: number
    page_size: number
}

export interface PostRequestRO extends PageRequestRO {
    tag_list?: string[] | null
    category?: string | null
    status?: PostStatusEnum | null
    deleted?: boolean
}

export interface PostUpdateRO {
    id: number
    title: string
    cover_id?: number | null
    preview: string
    content: string
    tag_id_list: number[]
    category_id?: number | null
}

export interface TagRO {
    id?: number | null
    name: string
    type?: TagTypeEnum | null
}

export interface LoginRO {
    username: string
    password: string
    totp?: string | null
}

export interface TrashBinRO {
    id: number
    type: EntityTypeEnum
    delete?: boolean
}
