import {TagRO} from "@/model/request"
import {TagVO} from "@/model/response"
import {TagTypeEnum} from "@/model/enum"
import {http} from "@/common.ts"


export const newTag = (tag: TagRO) => {
    return http.post<TagVO>('/tag/create', tag)
}

export const updateTag = (tag: TagRO) => {
    return http.post<TagVO>('/tag/update', tag)
}

export const getAllTag = (tagTypeEnum: TagTypeEnum) => {
    return http.post<TagVO[]>('/tag/all', {type: tagTypeEnum})
}

export const deleteTag = (tagId: number) => {
    return http.deleteVoid(`/tag/delete/${tagId}`)
}
