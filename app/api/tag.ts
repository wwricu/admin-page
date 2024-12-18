import axios, {AxiosResponse} from "axios";
import {TagVO} from "@/app/model/response";

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true

export const getAllTag = async () => {
    return await axios.get('/open/tag/all').then((res: AxiosResponse<TagVO[]>) => res.data);
}

export const getAllCategory = async () => {
    return await axios.get('/open/category/all').then((res: AxiosResponse<TagVO[]>) => res.data);
}

