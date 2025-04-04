import {AxiosResponse} from "axios"
import {ConfigRO} from "../model/request.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "../model/enum.ts"
import {myAxios} from "./common.ts";

export const databaseAPI = async (action: DatabaseActionEnum) => {
    return await myAxios.get(`/manage/database?action=${action}`).then((res: AxiosResponse<null>) => res.data)
}

export const setConfigAPI = async (config: ConfigRO) => {
    return await myAxios.post('/manage/config/set', config).then((res: AxiosResponse<null>) => res.data)
}

export const getConfigAPI = async (key: ConfigKeyEnum) => {
    return await myAxios.get(`/manage/config/get?key=${key}`).then((res: AxiosResponse<string | null>) => res.data)
}
