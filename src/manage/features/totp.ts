import {enrollTotpAPI, runCommandAPI} from '@/api/manage.ts'
import {ManageCommandEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

export const totp = (ui: Ui, {enforced, reload}: {enforced: boolean | null; reload: () => Promise<void>}): Section => ({
    key: 'totp',
    title: 'TOTP',
    actions: enforced === null ? [] : [enforced ? {
        label: 'Disable TOTP',
        confirm: 'Sure to disable TOTP protection?',
        success: 'success',
        run: async () => {
            await runCommandAPI(ManageCommandEnum.DISABLE_TOTP)
            await reload()
        },
    } : {
        label: 'Enforce TOTP',
        confirm: 'Enroll a new TOTP secret?',
        run: async () => {
            const secret = await enrollTotpAPI()
            ui.dialog({
                title: secret,
                input: {placeholder: '6-pin code from authenticator'},
                value: '',
                onSubmit: async (code) => {
                    await runCommandAPI(ManageCommandEnum.CONFIRM_TOTP, code)
                    await reload()
                },
            })
        },
    }],
})
