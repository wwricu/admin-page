import {AxiosResponse} from "axios"
import {ConfigRO, TrashBinRO, UserRO} from "../model/request.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "../model/enum.ts"
import {myAxios} from "./common.ts";
import {TrashBinVO} from "../model/response.ts";

export const databaseAPI = async (action: DatabaseActionEnum) => {
    return await myAxios.get(`/manage/database?action=${action}`).then(() => {})
}

export const setConfigAPI = async (config: ConfigRO) => {
    return await myAxios.post('/manage/config/set', config).then(() => {})
}

export const getConfigAPI = async (key: ConfigKeyEnum) => {
    return await myAxios.get(`/manage/config/get?key=${key}`).then((res: AxiosResponse<string | null>) => res.data)
}

export const userAPI = async (userRO: UserRO) => {
    return await myAxios.post('/manage/user', userRO).then(() => {})
}

export const trashGetAllAPI = async () => {
    return await myAxios.get('/manage/trash/all').then((res: AxiosResponse<TrashBinVO[]>) => res.data)
}

export const trashEditAPI = async (trashBinRO: TrashBinRO) => {
    return await myAxios.post('/manage/trash/edit', trashBinRO).then(() => {})
}

export const totpEnforceAPI = async (enforce: boolean) => {
    return await myAxios.get(`/manage/totp/enforce?enforce=${enforce}`).then((res: AxiosResponse<string | null>) => res.data)
}

export const totpConfirmAPI = async (totp: string) => {
    return await myAxios.get(`/manage/totp/confirm?totp=${totp}`).then(() => {})
}
