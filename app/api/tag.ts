import axios, {AxiosResponse} from "axios";
import {TagVO} from "@/app/model/response";
import {TagBatchRO, TagRO, TagTypeEnum} from "@/app/model/request";

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true

export const newTag = async (tag: TagRO) => {
    return await axios.post('/tag/create', tag).then((res: AxiosResponse<TagVO>) => res.data);
}

export const updateTag = async (tag: TagRO) => {
    return await axios.post('/tag/update', tag).then((res: AxiosResponse<TagVO>) => res.data);
}

export const getAllTag = async (tagTypeEnum: TagTypeEnum) => {
    const url = tagTypeEnum === TagTypeEnum.POST_TAG ? '/open/tag/all' : 'open/category/all'
    return await axios.get(url).then((res: AxiosResponse<TagVO[]>) => res.data);
}

export const deleteTag = async (tagId: number, type: TagTypeEnum) => {
    const tagBatchRO: TagBatchRO = {
        id_list: [tagId],
        type: type
    }
    return await axios.post('/tag/delete', tagBatchRO).then((res: AxiosResponse<number>) => res.data);
}
