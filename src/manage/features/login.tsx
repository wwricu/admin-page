import {Flex, Input} from 'antd'
import {getValueAPI, runCommandAPI} from '@/api/manage.ts'
import {LoginRO} from '@/model/request.ts'
import {ManageCommandEnum, ManageReadEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

const withField = (value: string, field: 'username' | 'password', text: string) =>
    JSON.stringify({...JSON.parse(value) as LoginRO, [field]: text})

export const login = (ui: Ui): Section => ({
    key: 'login',
    title: 'Login',
    actions: [
        {
            label: 'Set username and password',
            run: async () => ui.dialog({
                title: 'Set username and password',
                value: JSON.stringify({username: (await getValueAPI(ManageReadEnum.USERNAME)) ?? '', password: ''}),
                body: (value, onChange) => {
                    const {username, password} = JSON.parse(value) as LoginRO
                    return (
                        <Flex vertical gap='small'>
                            <Input value={username} placeholder='Username' onChange={(e) => onChange(withField(value, 'username', e.target.value))}/>
                            <Input.Password value={password} placeholder='New password' onChange={(e) => onChange(withField(value, 'password', e.target.value))}/>
                        </Flex>
                    )
                },
                onSubmit: (value) => runCommandAPI(ManageCommandEnum.SET_LOGIN, value).then(ui.relogin),
            }),
        },
    ],
})
