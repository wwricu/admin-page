import {TrashBinRO} from "@/model/request.ts"
import {DatabaseActionEnum, ConfigKeyEnum, ManageCommandEnum} from "@/model/enum.ts"
import {http} from "@/common.ts"
import {TrashBinVO} from "@/model/response.ts"

export const databaseAPI = (action: DatabaseActionEnum) => {
    return http.postVoid('/manage/database', {action})
}

export const runCommandAPI = (command: ManageCommandEnum, value = '') => {
    return http.postVoid('/manage/command', {command, value})
}

export const enrollTotpAPI = () => {
    return http.post<string>('/manage/command', {command: ManageCommandEnum.ENROLL_TOTP, value: ''})
}

export const getValueAPI = (key: ConfigKeyEnum) => {
    return http.get<string | null>(`/manage/config/get?key=${key}`)
}

export const trashGetAllAPI = () => {
    return http.get<TrashBinVO[]>('/manage/trash/all')
}

export const trashEditAPI = (trashBinRO: TrashBinRO) => {
    return http.postVoid('/manage/trash/edit', trashBinRO)
}
