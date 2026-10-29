import React, {lazy, Suspense, useEffect, useState} from 'react'
import {Button, Input, List, message, Modal, Popconfirm, Spin} from 'antd'
import {databaseAPI, getConfigAPI, setConfigAPI, totpConfirmAPI, totpEnforceAPI, userAPI} from "@/api/manage.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "@/model/enum.ts"
import {useNavigate} from "react-router-dom"

// Lazy so that opening /management does not download the CKEditor bundle.
const LazyAboutEditor = lazy(() => import('./AboutEditor'))

type Action = {
    label: string
    // Present when the action must be confirmed first
    confirm?: string
    // Shown once the call succeeds; actions that open a dialog have nothing to announce
    success?: string
    run: () => Promise<void> | void
}

type Section = {
    key: string
    title: string
    actions: Action[]
}

// The page has exactly one dialog at a time. Both a plain input and a custom body (the About
// editor) edit the same `value`, so the pending edit cannot get lost between two Modal states.
type Dialog = {
    title: string
    width?: number
    input?: { placeholder: string; secret?: boolean }
    body?: (value: string, onChange: (value: string) => void) => React.ReactNode
    value: string
    onSubmit: (value: string) => Promise<void>
}

export default function ManagePage() {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [dialog, setDialog] = useState<Dialog | null>(null)
    const [username, setUsername] = useState('')
    const [aboutContent, setAboutContent] = useState('')
    const [totpEnforce, setTotpEnforce] = useState<boolean>(false)
    const navigate = useNavigate()

    const notify = (content: string) => messageApi.success(content).then()

    const execute = async (action: Action) => {
        try {
            await action.run()
        } catch {
            return // already toasted in the http layer
        }
        if (action.success) {
            notify(action.success)
        }
    }

    const loadTotpEnforce = async () => {
        const enforce = await getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE)
        setTotpEnforce(!!enforce)
    }

    useEffect(() => {
        document.title = 'Admin - Management - wwr.icu'
        Promise.all([
            getConfigAPI(ConfigKeyEnum.ABOUT_CONTENT),
            getConfigAPI(ConfigKeyEnum.USERNAME),
            getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE),
        ]).then(([about, name, enforce]) => {
            setAboutContent(about ?? '')
            setUsername(name ?? '')
            setTotpEnforce(!!enforce)
        }).catch(() => {})
    }, [])

    const openInputDialog = (options: {
        title: string
        placeholder: string
        secret?: boolean
        defaultValue?: string
        onSubmit: (value: string) => Promise<void>
    }) => {
        setDialog({
            title: options.title,
            input: {placeholder: options.placeholder, secret: options.secret},
            value: options.defaultValue ?? '',
            onSubmit: options.onSubmit,
        })
    }

    const openAboutDialog = () => {
        setDialog({
            title: 'About Page',
            width: 800,
            body: (value, onChange) => (
                <Suspense fallback={<Spin style={{display: 'block', margin: '48px auto'}}/>}>
                    <LazyAboutEditor content={value} setContent={onChange}/>
                </Suspense>
            ),
            value: aboutContent,
            onSubmit: (value) => setConfigAPI({key: ConfigKeyEnum.ABOUT_CONTENT, value}),
        })
    }

    const submitDialog = async (current: Dialog) => {
        const value = current.input ? current.value.trim() : current.value
        if (current.input && !value) {
            messageApi.error('Please input a valid value').then()
            return
        }
        try {
            await current.onSubmit(value)
        } catch {
            return // dialog stays open, the http layer already toasted
        }
        setDialog(null)
        notify('success')
    }

    const resetLogin = async () => {
        await userAPI({reset: true})
        navigate('/login')
    }

    const enforceTotp = async () => {
        const secret = await totpEnforceAPI(true)
        if (!secret) {
            messageApi.error('Failed to enforce totp').then()
            return
        }
        openInputDialog({
            title: secret,
            placeholder: '6-pin code from authenticator',
            onSubmit: async (totp) => {
                await totpConfirmAPI(totp)
                await loadTotpEnforce()
            },
        })
    }

    const sections: Section[] = [
        {
            key: 'about',
            title: 'About Page',
            actions: [
                {label: 'Edit', run: openAboutDialog},
            ],
        },
        {
            key: 'login',
            title: 'Login',
            actions: [
                {
                    label: 'Set username',
                    run: () => openInputDialog({
                        title: 'Set username',
                        placeholder: 'Username',
                        defaultValue: username,
                        onSubmit: async (value) => {
                            await userAPI({username: value})
                            navigate('/login')
                        },
                    }),
                },
                {
                    label: 'Set password',
                    run: () => openInputDialog({
                        title: 'Input new Password',
                        placeholder: 'New password',
                        secret: true,
                        onSubmit: async (value) => {
                            await userAPI({password: value})
                            navigate('/login')
                        },
                    }),
                },
                {
                    label: 'Reset all to default',
                    confirm: 'Sure to reset username and password to default?',
                    success: 'success',
                    run: resetLogin,
                },
            ],
        },
        {
            key: 'database',
            title: 'Database',
            actions: [
                {
                    label: 'Backup to cloud',
                    confirm: 'Sure to backup database? This will override cloud database',
                    success: 'Database backup successfully',
                    run: () => databaseAPI(DatabaseActionEnum.BACKUP),
                },
                {
                    label: 'Restore from cloud',
                    confirm: 'Sure to restore database? This will override local database',
                    success: 'Database restore successfully',
                    run: () => databaseAPI(DatabaseActionEnum.RESTORE),
                },
                {
                    label: 'Download to local',
                    confirm: 'Download database to local?',
                    run: () => { window.open('/api/manage/database') },
                },
            ],
        },
        {
            key: 'totp',
            title: 'TOTP',
            actions: [
                totpEnforce ? {
                    label: 'Disable TOTP',
                    confirm: 'Sure to disable TOTP protection?',
                    success: 'success',
                    run: async () => {
                        await totpEnforceAPI(false)
                        await loadTotpEnforce()
                    },
                } : {
                    label: 'Enforce TOTP',
                    run: enforceTotp,
                },
            ],
        },
    ]

    const renderAction = (action: Action) => {
        if (action.confirm) {
            return (
                <Popconfirm
                    key={action.label}
                    title={action.confirm}
                    okButtonProps={{variant: 'solid', color: 'danger'}}
                    onConfirm={() => execute(action)}
                >
                    <Button size='small'>{action.label}</Button>
                </Popconfirm>
            )
        }
        return (
            <Button key={action.label} size='small' onClick={() => execute(action)}>
                {action.label}
            </Button>
        )
    }

    const changeDialogValue = (value: string) => setDialog((prev) => prev && {...prev, value})

    return (
        <>
            {messageContextHolder}
            <List
                size='small'
                bordered
                dataSource={sections}
                renderItem={(section: Section) => (
                    <List.Item actions={section.actions.map(renderAction)}>
                        {section.title}
                    </List.Item>
                )}
            />
            <Modal
                open={dialog !== null}
                title={dialog?.title}
                width={dialog?.width}
                closable={false}
                // closable={false} alone still closes on mask click, which would throw away the
                // TOTP secret and any pending edit.
                maskClosable={false}
                destroyOnHidden
                onCancel={() => setDialog(null)}
                onOk={() => dialog && submitDialog(dialog)}
            >
                {
                    dialog?.input
                        ? (dialog.input.secret
                            ? <Input.Password value={dialog.value} placeholder={dialog.input.placeholder} onChange={(e) => changeDialogValue(e.target.value)}/>
                            : <Input value={dialog.value} placeholder={dialog.input.placeholder} onChange={(e) => changeDialogValue(e.target.value)}/>)
                        : dialog?.body?.(dialog.value, changeDialogValue)
                }
            </Modal>
        </>
    )
}
