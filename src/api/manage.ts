import {ConfigRO, TrashBinRO, UserRO} from "@/model/request.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "@/model/enum.ts"
import {http} from "@/common.ts"
import {TrashBinVO} from "@/model/response.ts"

export const databaseAPI = async (action: DatabaseActionEnum) => {
    return await http.get(`/manage/database?action=${action}`).then(() => {})
}

export const setConfigAPI = async (config: ConfigRO) => {
    return await http.post('/manage/config/set', config).then(() => {})
}

export const getConfigAPI = async (key: ConfigKeyEnum) => {
    return await http.get<string | null>(`/manage/config/get?key=${key}`)
}

export const userAPI = async (userRO: UserRO) => {
    return await http.post('/manage/user', userRO).then(() => {})
}

export const trashGetAllAPI = async () => {
    return await http.get<TrashBinVO[]>('/manage/trash/all')
}

export const trashEditAPI = async (trashBinRO: TrashBinRO) => {
    return await http.post('/manage/trash/edit', trashBinRO).then(() => {})
}

export const totpEnforceAPI = async (enforce: boolean) => {
    return await http.get<string | null>(`/manage/totp/enforce?enforce=${enforce}`)
}

export const totpConfirmAPI = async (totp: string) => {
    return await http.get(`/manage/totp/confirm?totp=${totp}`).then(() => {})
}
