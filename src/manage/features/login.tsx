import {Button, Flex, Input, Popconfirm, Table} from 'antd'
import {enrollTotpAPI, getValueAPI, runCommandAPI} from '@/api/manage.ts'
import {infoAPI} from '@/api/common.ts'
import {LoginRO} from '@/model/request.ts'
import {SessionVO} from '@/model/response.ts'
import {ConfigKeyEnum, ManageCommandEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

const withField = (value: string, field: 'username' | 'password', text: string) =>
    JSON.stringify({...JSON.parse(value) as LoginRO, [field]: text})

const shortUA = (ua: string) => {
    const os = (ua.match(/Android/) ?? ua.match(/Windows|iPhone|iPad|Macintosh|Linux/))?.[0] ?? ''
    const noise = ['Mozilla', 'AppleWebKit', 'KHTML', 'Gecko', 'Mobile', 'Safari', 'Build']
    const tokens = [...ua.matchAll(/([A-Za-z][A-Za-z0-9]*)\/(\d+)/g)].filter(m => !noise.includes(m[1]))
    const browser = tokens[tokens.length - 1]
    if (!browser) return ua
    const names: Record<string, string> = {Edg: 'Edge', OPR: 'Opera', Version: 'Safari'}
    return `${os} ${names[browser[1]] ?? browser[1]} ${browser[2]}`.trim()
}

const write = (ui: Ui, command: ManageCommandEnum, value = '') =>
    runCommandAPI(command, value).then(ui.relogin)

export const login = (ui: Ui, {enforced, reload}: {enforced: boolean | null; reload: () => Promise<void>}): Section => ({
    key: 'login',
    title: 'Auth',
    actions: [
        {
            label: 'Active sessions',
            run: async () => ui.dialog({
                title: 'Active sessions',
                width: 720,
                value: JSON.stringify(await infoAPI()),
                body: (value, onChange) => {
                    const sessions = JSON.parse(value) as SessionVO[]
                    const logout = (id: string) => runCommandAPI(ManageCommandEnum.LOGOUT, id).then(() => {
                        onChange(JSON.stringify(sessions.filter((s) => s.id !== id)))
                        ui.notify('Session logged out')
                    }).catch(() => {})
                    return (
                        <Table<SessionVO>
                            size='small'
                            rowKey='id'
                            dataSource={sessions}
                            pagination={false}
                            columns={[
                                {title: 'UA', dataIndex: 'ua', ellipsis: true, render: (ua: string) => <span title={ua}>{shortUA(ua)}</span>},
                                {title: 'Last active', dataIndex: 'last_active', width: 150, render: (v: string) => v.slice(0, 16).replace('T', ' ')},
                                {
                                    title: '', width: 80,
                                    render: (_, s) => (
                                        <Popconfirm title='Log out this session?' onConfirm={() => logout(s.id)}>
                                            <Button size='small' danger>Logout</Button>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
                        />
                    )
                },
            }),
        },
        {
            label: 'Set username and password',
            run: async () => ui.dialog({
                title: 'Set username and password',
                value: JSON.stringify({username: (await getValueAPI(ConfigKeyEnum.USERNAME)) ?? '', password: ''}),
                body: (value, onChange) => {
                    const {username, password} = JSON.parse(value) as LoginRO
                    return (
                        <Flex vertical gap='small'>
                            <Input value={username} placeholder='Username (4+ chars, letter first)' onChange={(e) => onChange(withField(value, 'username', e.target.value))}/>
                            <Input.Password value={password} placeholder='New password (8+ chars, with a symbol)' onChange={(e) => onChange(withField(value, 'password', e.target.value))}/>
                        </Flex>
                    )
                },
                onSubmit: (value) => write(ui, ManageCommandEnum.SET_LOGIN, value),
            }),
        },
        {
            label: 'Reset all to default',
            confirm: 'Sure to reset username and password to default?',
            success: 'success',
            run: () => write(ui, ManageCommandEnum.RESET_LOGIN),
        },
        ...(enforced === null ? [] : [enforced ? {
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
        }]),
    ],
})
