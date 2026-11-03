import {getConfigAPI, userAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import {UserRO} from '@/model/request.ts'
import type {Section, Ui} from '@/manage/ui.ts'

const write = (ui: Ui, user: UserRO) => userAPI(user).then(ui.relogin)

// The current username is read on open: a value that failed to load must not be submitted as current.
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
                onSubmit: (value) => write(ui, {username: value}),
            }),
        },
        {
            label: 'Set password',
            run: () => ui.dialog({
                title: 'Input new Password',
                input: {placeholder: 'New password', secret: true},
                value: '',
                onSubmit: (value) => write(ui, {password: value}),
            }),
        },
        {
            label: 'Reset all to default',
            confirm: 'Sure to reset username and password to default?',
            success: 'success',
            run: () => write(ui, {reset: true}),
        },
    ],
})
