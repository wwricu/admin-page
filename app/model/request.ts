

export interface PostRequestRO {
    page_index: number
    page_size: number
    tag_list?: string[]
    cat_id?: string| undefined
    status?: string | undefined
    deleted?: boolean | undefined
}

export interface PostCreateRO {
    title: string
    cover?: string
    content?: string
    tag_id_list?: number[]
    category_id?: number
}
