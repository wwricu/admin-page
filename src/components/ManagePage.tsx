'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Button, Flex, Input, InputRef, message, Modal, Popconfirm, Table} from 'antd'
import {databaseAPI, getConfigAPI, totpConfirmAPI, totpEnforceAPI, userAPI} from "../api/manage.ts"
import {ConfigKeyEnum, DatabaseActionEnum} from "../model/enum.ts"
import AboutEditor from "./AboutEditor.tsx"
import {baseUrl} from "../api/common.ts"
import {useNavigate} from "react-router-dom"

const {Column} = Table

type Action = {
    name: string,
    handle: () => void,
    confirmMessage?: string
}

type ActionRow = {
    key: string,
    title: string | React.ReactNode,
    actions: Action[]
}

export default function ManagePage() {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>()
    const [totpEnforce, setTotpEnforce] = useState<boolean>(false)

    const [dynamicModal, setDynamicModal] = useState<{
        open: boolean
        title: string
        content: React.ReactNode
        onOk: () => Promise<void>
    } | null>(null)

    const getTotpEnforce = () => {
        getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE).then((res: string | null) => {
            setTotpEnforce(!!res)
        })
    }

    useEffect(() => {
        getConfigAPI(ConfigKeyEnum.USERNAME).then((res: string | null) => {
            setUsername(res ?? '')
        })
        getTotpEnforce()
    })

    const actionTableData: ActionRow[] = [
        {
            key: 'about',
            title: 'About Page',
            actions: [
                {
                    name: 'Edit',
                    handle: () => {
                        setIsAboutModalOpen(true)
                    }
                }
            ]
        },
        {
            key: 'login',
            title: 'Login',
            actions: [
                {
                    name: 'Set username',
                    handle: () => {
                        setDynamicModal({
                            open: true,
                            title: 'Set username',
                            content: <Input
                                ref={inputRef}
                                defaultValue={username}
                                style={{ marginTop: 12, marginBottom: 12 }}
                            />,
                            onOk: () => {
                                const username = inputRef?.current?.input?.value
                                return new Promise((resolve: (value: void) => void, reject: () => void) => {
                                    if (!username) {
                                        messageApi.error('Please input valid username').then()
                                        reject()
                                    } else {
                                        userAPI({username: username}).then(
                                            () => {
                                                messageApi.success('success').then()
                                                setDynamicModal(null)
                                                resolve()
                                                navigate('/login')
                                            }
                                        )
                                    }
                                })
                            }
                        })
                    },
                },
                {
                    name: 'Set password',
                    handle: () => {
                        setDynamicModal({
                            open: true,
                            title: 'Input new Password',
                            content: <Input.Password
                                ref={inputRef}
                                placeholder='New password'
                                style={{ marginTop: 12, marginBottom: 12 }}
                            />,
                            onOk: () => {
                                const password = inputRef?.current?.input?.value
                                return new Promise((resolve: (value: void) => void, reject: () => void) => {
                                    if (!password) {
                                        messageApi.error('Please input valid password').then()
                                        reject()
                                    } else {
                                        userAPI({password: password}).then(
                                            () => {
                                                messageApi.success('success').then()
                                                setDynamicModal(null)
                                                resolve()
                                                navigate('/login')
                                            },
                                        ).catch(() => reject())
                                    }
                                })
                            }
                        })
                    },
                },
                {
                    name: 'Reset all to default',
                    handle: () => {
                        userAPI({reset: true}).then(
                            () => {
                                messageApi.success('success').then()
                                navigate('/login')
                            }
                        )
                    },
                    confirmMessage: 'Sure to reset username and password to default?',
                }
            ]
        },
        {
            key: 'database',
            title: 'Database',
            actions: [
                {
                    name: 'Backup to cloud',
                    handle: () => {databaseAPI(DatabaseActionEnum.BACKUP).then(() => {
                        messageApi.success('Database backup successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override cloud database'
                },
                {
                    name: 'Restore from cloud',
                    handle: () => {databaseAPI(DatabaseActionEnum.RESTORE).then(() => {
                        messageApi.success('Database restore successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override local database'
                },
                {
                    name: 'Download to local',
                    handle: () => {
                        window.open(`${baseUrl}/manage/database?action=${DatabaseActionEnum.DOWNLOAD}`)
                    },
                    confirmMessage: 'Download database to local?'
                }
            ]
        },
        {
            key: 'totp',
            title: 'TOTP',
            actions: [
                {
                    name: totpEnforce ? 'Disable TOTP' : 'Enforce TOTP',
                    confirmMessage: totpEnforce ? 'Download database to local?' : undefined,
                    handle: () => {
                        if (totpEnforce) {
                            totpEnforceAPI(false).then(
                                getTotpEnforce).then(
                                () => messageApi.success('success').then()
                            )
                            return
                        }
                        totpEnforceAPI(true).then(secret => {
                            if (!secret) {
                                messageApi.error('Failed to enforce totp').then(console.error)
                                return
                            }
                            setDynamicModal({
                                open: true,
                                title: secret,
                                content: <Input
                                    ref={inputRef}
                                    placeholder='6-pin code from authenticator'
                                    style={{ marginTop: 12, marginBottom: 12 }}
                                />,
                                onOk: () => {
                                    // const promise: Promise<T> = new Promise((resolve: (value: T) => void, reject: () => void) => {})
                                    return new Promise((resolve: (value: void) => void, reject: () => void) => {
                                        totpConfirmAPI(inputRef?.current?.input?.value ?? '').then(
                                            getTotpEnforce).then(
                                            () => {
                                                messageApi.success('success').then()
                                                setDynamicModal(null)
                                                resolve()
                                            }
                                        ).catch(() => reject())
                                    })
                                }
                            })
                        })
                    }
                }
            ]
        },
    ]

    return (
        <>
            {messageContextHolder}
            {
                dynamicModal &&
                (
                    <Modal
                        closable={false}
                        open={dynamicModal.open}
                        title={dynamicModal.title}
                        onOk={dynamicModal.onOk}
                        onCancel={() => setDynamicModal(null)}
                        centered
                    >
                        {dynamicModal.content}
                    </Modal>
                )
            }
            <AboutEditor
                open={isAboutModalOpen}
                onCancel={() => setIsAboutModalOpen(false)}
                onOk={() => setIsAboutModalOpen(false)}
            />
            <Table
                <ActionRow>
                scroll={{ x: true }}
                size='small'
                dataSource={actionTableData}
                pagination={false}
            >
                <Column
                    title='Name'
                    dataIndex='title'
                    key='title'
                    ellipsis={true}
                />
                <Column
                    title='Actions'
                    key='actions'
                    render={(_, row: ActionRow) => (
                        <Flex key={row.key} justify='flex-start' gap='middle'>
                            {row?.actions.map((action: Action) =>
                                action.confirmMessage ? (
                                    <Popconfirm
                                        key={action.name}
                                        title={`Sure to ${action.name}?`}
                                        onConfirm={action.handle}
                                        okButtonProps={{variant: 'solid', color: 'danger'}}
                                    >
                                        <Button size='small'>{action.name}</Button>
                                    </Popconfirm>
                                ) : (
                                    <Button key={action.name} size='small' onClick={action.handle}>
                                        {action.name}
                                    </Button>
                                )
                            )}
                        </Flex>
                    )}
                />
            </Table>
        </>
    )
}
