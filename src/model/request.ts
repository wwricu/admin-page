// Mirrors the request models in wwricu/domain/{post,tag,common}.py. Fields the backend declares
// with a default stay optional here; fields it declares as required must stay required, otherwise
// JSON.stringify drops them and pydantic rejects the whole body with a 422.
import {ConfigKeyEnum, EntityTypeEnum, PostStatusEnum, TagTypeEnum} from "@/model/enum.ts"

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

export interface TagRequestRO {
    page_size?: number | null
    page_index?: number | null
    type?: TagTypeEnum | null
}

export interface LoginRO {
    username: string
    password: string
    totp?: string | null
}

export interface ConfigRO {
    key: ConfigKeyEnum
    value?: string | null
}

export interface UserRO {
    username?: string | null
    password?: string | null
    reset?: boolean | null
}

export interface TrashBinRO {
    id: number
    type: EntityTypeEnum
    delete?: boolean
}
