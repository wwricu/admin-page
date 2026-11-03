import {getConfigAPI, setConfigAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

// Writing any part of the login ends the session, so the admin signs in again with what they set.
const write = (ui: Ui, key: ConfigKeyEnum, value: string | null) =>
    setConfigAPI({key, value}).then(ui.relogin)

export const login = (ui: Ui): Section => ({
    key: 'login',
    title: 'Login',
    actions: [
        {
            // The current username is read on open: a value that failed to load must not be
            // submitted as current.
            label: 'Set username',
            run: async () => ui.dialog({
                title: 'Set username',
                input: {placeholder: 'Username'},
                value: (await getConfigAPI(ConfigKeyEnum.USERNAME)) ?? '',
                onSubmit: (value) => write(ui, ConfigKeyEnum.USERNAME, value),
            }),
        },
        {
            label: 'Set password',
            run: () => ui.dialog({
                title: 'Input new Password',
                input: {placeholder: 'New password', secret: true},
                value: '',
                onSubmit: (value) => write(ui, ConfigKeyEnum.PASSWORD, value),
            }),
        },
        {
            // One null write deletes both rows in one statement; two separate deletes would leave a
            // half-reset login that nobody can sign into to repair.
            label: 'Reset all to default',
            confirm: 'Sure to reset username and password to default?',
            success: 'success',
            run: () => write(ui, ConfigKeyEnum.USERNAME, null),
        },
    ],
})
