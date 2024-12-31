import axios, {AxiosResponse} from "axios"
import {TagVO} from "@/app/model/response"
import {GetTagRO, TagBatchRO, TagRO} from "@/app/model/request"
import {TagTypeEnum} from "@/app/model/enum";


export const newTag = async (tag: TagRO) => {
    return await axios.post('/tag/create', tag).then((res: AxiosResponse<TagVO>) => res.data)
}

export const updateTag = async (tag: TagRO) => {
    return await axios.post('/tag/update', tag).then((res: AxiosResponse<TagVO>) => res.data)
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
    return await axios.post('/open/tags', request).then((res: AxiosResponse<TagVO[]>) => res.data)
}

export const deleteTag = async (tagId: number, type: TagTypeEnum) => {
    const tagBatchRO: TagBatchRO = {
        id_list: [tagId],
        type: type
    }
    return await axios.post('/tag/delete', tagBatchRO).then((res: AxiosResponse<number>) => res.data)
}
