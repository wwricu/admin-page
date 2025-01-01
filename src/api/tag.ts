import {AxiosResponse} from "axios"
import {TagVO} from "../model/response"
import {GetTagRO, TagBatchRO, TagRO} from "../model/request"
import {TagTypeEnum} from "../model/enum";
import {myAxios} from "../api/common";


export const newTag = async (tag: TagRO) => {
    return await myAxios.post('/tag/create', tag).then((res: AxiosResponse<TagVO>) => res.data)
}

export const updateTag = async (tag: TagRO) => {
    return await myAxios.post('/tag/update', tag).then((res: AxiosResponse<TagVO>) => res.data)
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
    return await myAxios.post('/open/tags', request).then((res: AxiosResponse<TagVO[]>) => res.data)
}

export const deleteTag = async (tagId: number, type: TagTypeEnum) => {
    const tagBatchRO: TagBatchRO = {
        id_list: [tagId],
        type: type
    }
    return await myAxios.post('/tag/delete', tagBatchRO).then((res: AxiosResponse<number>) => res.data)
}
