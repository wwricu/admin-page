import {setConfigAPI, totpConfirmAPI, totpEnrollAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

export const totp = (ui: Ui, {enforced, reload}: {enforced: boolean; reload: () => Promise<void>}): Section => ({
    key: 'totp',
    title: 'TOTP',
    actions: [
        enforced ? {
            label: 'Disable TOTP',
            confirm: 'Sure to disable TOTP protection?',
            success: 'success',
            // A null write takes the secret with it: enforcement without a secret would ask at
            // login for a code that can never be right.
            run: async () => {
                await setConfigAPI({key: ConfigKeyEnum.TOTP_ENFORCE, value: null})
                await reload()
            },
        } : {
            // Enrolling is an exchange the server drives: the secret comes back and is shown once as
            // the dialog title, and the code typed from it is what confirms.
            label: 'Enforce TOTP',
            run: async () => {
                const secret = await totpEnrollAPI()
                ui.dialog({
                    title: secret,
                    input: {placeholder: '6-pin code from authenticator'},
                    value: '',
                    onSubmit: async (code) => {
                        await totpConfirmAPI(code)
                        await reload()
                    },
                })
            },
        },
    ],
})
