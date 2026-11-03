import {totpConfirmAPI, totpEnforceAPI} from '@/api/manage.ts'
import type {Section, Ui} from '@/manage/ui.ts'

export const totp = (ui: Ui, {enforced, reload}: {enforced: boolean; reload: () => Promise<void>}): Section => ({
    key: 'totp',
    title: 'TOTP',
    actions: [
        enforced ? {
            label: 'Disable TOTP',
            confirm: 'Sure to disable TOTP protection?',
            success: 'success',
            run: async () => {
                await totpEnforceAPI(false)
                await reload()
            },
        } : {
            // Enrolling is an exchange the server drives: the secret comes back and is shown once as
            // the dialog title, and the code typed from it is what confirms.
            label: 'Enforce TOTP',
            run: async () => {
                const secret = await totpEnforceAPI(true)
                if (!secret) {
                    return // null is only the disable reply, and this call never disables
                }
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
