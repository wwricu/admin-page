import {TagRO, TagRequestRO} from "@/model/request"
import {TagVO} from "@/model/response"
import {TagTypeEnum} from "@/model/enum"
import {http} from "@/common.ts"


export const newTag = (tag: TagRO) => {
    return http.post<TagVO>('/tag/create', tag)
}

export const updateTag = (tag: TagRO) => {
    return http.post<TagVO>('/tag/update', tag)
}

export const getAllTag = (
    tagTypeEnum: TagTypeEnum,
    pageIndex: number | undefined = undefined,
    pageSize: number | undefined = undefined
) => {
    const request: TagRequestRO = {
        type: tagTypeEnum,
        page_index: pageIndex,
        page_size: pageSize
    }
    return http.post<TagVO[]>('/tag/all', request)
}

export const deleteTag = (tagId: number) => {
    return http.deleteVoid(`/tag/delete/${tagId}`)
}
