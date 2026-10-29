import {ConfigRO, TrashBinRO, UserRO} from "@/model/request.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "@/model/enum.ts"
import {http} from "@/common.ts"
import {TrashBinVO} from "@/model/response.ts"

export const databaseAPI = (action: DatabaseActionEnum) => {
    return http.postVoid('/manage/database', {action})
}

export const setConfigAPI = (config: ConfigRO) => {
    return http.postVoid('/manage/config/set', config)
}

export const getConfigAPI = (key: ConfigKeyEnum) => {
    return http.get<string | null>(`/manage/config/get?key=${key}`)
}

export const userAPI = (userRO: UserRO) => {
    return http.postVoid('/manage/user', userRO)
}

export const trashGetAllAPI = () => {
    return http.get<TrashBinVO[]>('/manage/trash/all')
}

export const trashEditAPI = (trashBinRO: TrashBinRO) => {
    return http.postVoid('/manage/trash/edit', trashBinRO)
}

export const totpEnforceAPI = (enforce: boolean) => {
    return http.post<string | null>('/manage/totp/enforce', {enforce})
}

export const totpConfirmAPI = (totp: string) => {
    return http.postVoid('/manage/totp/confirm', {totp})
}
