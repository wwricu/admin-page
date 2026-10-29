// Mirrors the response models in wwricu/domain/{post,tag,common}.py. Anything pydantic types as
// `X | None` is nullable here too: the backend really does send null for an untitled post, a
// post without a category, and a record whose timestamps were never set.
import {EntityTypeEnum, PostResourceTypeEnum, PostStatusEnum, TagTypeEnum} from "@/model/enum.ts"

export interface TagVO {
    id: number
    name: string
    type: TagTypeEnum
    count?: number | null
}

export interface PostResourceVO {
    id: number
    name?: string | null
    key: string
    url: string
    type: PostResourceTypeEnum
}

export interface PostPreviewVO {
    id: number
    title?: string | null
    cover?: PostResourceVO | null
    preview: string
    tag_list: TagVO[]
    category?: TagVO | null
    status?: PostStatusEnum | null
    create_time?: string | null
    update_time?: string | null
}

export interface PostDetailVO extends PostPreviewVO {
    content: string
}

export interface PageVO<T> {
    page_index?: number | null
    page_size?: number | null
    count: number
    data: T[]
}

export interface FileUploadVO {
    id: number
    name?: string | null
    key: string
    location: string
}

export interface TrashBinVO {
    id: number
    name: string
    info?: string | null
    type: EntityTypeEnum
    delete_time: string
}
