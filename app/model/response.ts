
export interface TagVO {
    id: number
    name: string
    type: string
}


export interface PostDetailVO {
    id: number
    title: string
    cover?: string
    content: string
    tag_list: TagVO[]
    category?: TagVO
    status: string
    create_time: string
    update_time: string
}


export enum PostStatusEnum {
    DRAFT = 'draft',
    PUBLISHED = 'published'
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
