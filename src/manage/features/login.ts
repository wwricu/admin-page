import {getConfigAPI, setConfigAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

const write = (ui: Ui, key: ConfigKeyEnum, value: string | null) =>
    setConfigAPI({key, value}).then(ui.relogin)

export const login = (ui: Ui): Section => ({
    key: 'login',
    title: 'Login',
    actions: [
        {
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
            label: 'Reset all to default',
            confirm: 'Sure to reset username and password to default?',
            success: 'success',
            run: () => write(ui, ConfigKeyEnum.USERNAME, null),
        },
    ],
})
