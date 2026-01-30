'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Button, Flex, Input, InputRef, message, Modal, Popconfirm, Table} from 'antd'
import {databaseAPI, getConfigAPI, totpConfirmAPI, totpEnforceAPI, userAPI} from "../api/manage.ts";
import {ConfigKeyEnum, DatabaseActionEnum} from "../model/enum.ts";
import AboutEditor from "./AboutEditor.tsx";
import {baseUrl} from "../api/common.ts";
import {useNavigate} from "react-router-dom";

const {Column} = Table

type Action = {
    name: string,
    handle: () => void,
    confirmMessage?: string
}

type ActionRow = {
    key: string,
    title: string,
    actions: Action[]
}


const ManagePage: React.FC = () => {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [modalApi, modalContextHolder] = Modal.useModal();
    const inputRef = useRef<InputRef>(null);
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>();
    const [totpEnforce, setTotpEnforce] = useState<boolean>(false);

    const getTotpEnforce = () => {
        getConfigAPI(ConfigKeyEnum.TOTP_ENFORCE).then((res: string | null) => {
            setTotpEnforce(!!res);
        })
    }

    useEffect(() => {
        getConfigAPI(ConfigKeyEnum.USERNAME).then((res: string | null) => {
            setUsername(res ?? '');
        })
        getTotpEnforce()
    })

    const actionTableData: ActionRow[] = [
        {
            key: '1',
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
            key: '2',
            title: 'Login',
            actions: [
                {
                    name: 'Set username',
                    handle: () => {
                        modalApi.confirm({
                            icon: null,
                            title: 'Set username',
                            content: <Input
                                ref={inputRef}
                                className='my-3.75'
                                defaultValue={username}
                            />,
                            onOk: () => {
                                const username = inputRef?.current?.input?.value
                                return new Promise((resolve: (value: unknown) => void, reject: () => void) => {
                                    if (!username) {
                                        messageApi.error('Please input valid username').then()
                                        reject()
                                    } else {
                                        userAPI({username: username}).then(
                                            () => messageApi.info('success')).then(
                                            () => {
                                                resolve(true)
                                                navigate('/login')
                                            }
                                        )
                                    }
                                });

                            }
                        });
                    },
                },
                {
                    name: 'Set password',
                    handle: () => {
                        modalApi.confirm({
                            icon: null,
                            title: 'Input new Password',
                            content: <Input className='my-3.75' ref={inputRef}/>,
                            onOk: () => {
                                const password = inputRef?.current?.input?.value
                                return new Promise((resolve: (value: unknown) => void, reject: () => void) => {
                                    if (!password) {
                                        messageApi.error('Please input valid password').then()
                                        reject()
                                    } else {
                                        userAPI({password: password}).then(
                                            () => messageApi.info('success')).then(
                                            () => {
                                                resolve(true)
                                                navigate('/login')
                                            },
                                        )
                                    }
                                });
                            }
                        });
                    },
                },
                {
                    name: 'Reset all to default',
                    handle: () => {
                        userAPI({reset: true}).then(
                            () => messageApi.info('success')).then(
                            () => navigate('/login')
                        )
                    },
                    confirmMessage: 'Sure to reset username and password to default?',
                }
            ]
        },
        {
            key: '3',
            title: 'Database',
            actions: [
                {
                    name: 'Backup to cloud',
                    handle: () => {databaseAPI(DatabaseActionEnum.BACKUP).then(() => {
                        messageApi.info('Database backup successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override cloud database'
                },
                {
                    name: 'Restore from cloud',
                    handle: () => {databaseAPI(DatabaseActionEnum.RESTORE).then(() => {
                        messageApi.info('Database restore successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override local database'
                },
                {
                    name: 'Download to local',
                    handle: () => {
                        window.open(`${baseUrl}/manage/database?action=${DatabaseActionEnum.DOWNLOAD}`)
                    }
                }
            ]
        },
        {
            key: '4',
            title: 'TOTP',
            actions: [
                {
                    name: totpEnforce ? 'Disable' : 'Enforce',
                    handle: () => {
                        if (totpEnforce) {
                            Modal.confirm({
                                title: 'Disable TOTP?',
                                onOk() {
                                   return new Promise((resolve: (value: unknown) => void) => {
                                        totpEnforceAPI(false).then(
                                            messageApi.info('success')).then(
                                            getTotpEnforce).then(
                                            () => resolve(true)
                                        )
                                    });
                                }
                              })
                            return
                        }
                        totpEnforceAPI(true).then(secret => {
                            if (!secret) {
                                messageApi.error('Failed to enforce totp').then(console.error)
                                return
                            }
                            modalApi.confirm({
                                icon: null,
                                title: 'Confirm totp',
                                content: <>
                                    {secret}
                                    <Input
                                        ref={inputRef}
                                        className='my-3.75'
                                    />
                                </>,
                                onOk: () => {
                                    return new Promise((resolve: (value: unknown) => void, reject: () => void) => {
                                        totpConfirmAPI(inputRef?.current?.input?.value ?? '').then(
                                            messageApi.info('success')).then(
                                            () => resolve(true)).then(
                                            getTotpEnforce).finally(reject)
                                    });
                                }
                            });
                        })
                    }
                }
            ]
        },
    ]

    return (
        <>
            {messageContextHolder}
            {modalContextHolder}
            <AboutEditor
                open={isAboutModalOpen}
                onCancel={() => setIsAboutModalOpen(false)}
                onOk={() => setIsAboutModalOpen(false)}
            />
            <Table
                <ActionRow>
                className='m-1'
                scroll={{ x: true }}
                size='small'
                dataSource={actionTableData}
                pagination={false}
            >
                <Column
                    title='Name'
                    dataIndex='title'
                    key='title'
                />
                <Column
                    title='Actions'
                    key='actions'
                    render={(_, row: ActionRow) => (
                        <Flex key={row.key} justify='flex-start' gap='middle'>
                            {row?.actions.map((action: Action) =>
                                action.confirmMessage ? (
                                    <Popconfirm key={action.name} title={`Sure to ${action.name}?`} onConfirm={action.handle}>
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

export default ManagePage
