import {TagVO} from "@/model/response"
import {GetTagRO, TagRO} from "@/model/request"
import {TagTypeEnum} from "@/model/enum"
import {http} from "@/common.ts"


export const newTag = async (tag: TagRO) => {
    return await http.post<TagVO>('/tag/create', tag)
}

export const updateTag = async (tag: TagRO) => {
    return await http.post<TagVO>('/tag/update', tag)
}

export const getAllTag = async (
    tagTypeEnum: TagTypeEnum,
    pageIndex: number | undefined = undefined,
    pageSize: number | undefined = undefined
) => {
    const request: GetTagRO = {
        type: tagTypeEnum,
        page_index: pageIndex,
        page_size: pageSize
    }
    return await http.post<TagVO[]>('/tag/all', request)
}

export const deleteTag = async (tagId: number) => {
    return await http.get(`/tag/delete/${tagId}`).then(() => {})
}
