import {ConfigKeyEnum, TagTypeEnum} from "./enum.ts";

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
    title: string
    cover_id?: number
    content: string
    preview?: string
    tag_id_list: number[]
    category_id?: number
    status: string
}

export interface TagRO {
    id?: number
    name: string
    type: string
}

export interface GetTagRO {
    page_size?: number
    page_index?: number
    type: TagTypeEnum
}

export interface LoginRO {
    username: string
    password: string
    captcha?: string
    otp?: string
}

export interface ConfigRO {
    key: ConfigKeyEnum
    value?: string
}

export interface UserRO {
    username?: string
    password?: string
    reset?: boolean
}
