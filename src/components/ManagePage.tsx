'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Input, InputRef, message, Modal, Popconfirm, Space, Table, Typography} from 'antd'
import {databaseAPI, getConfigAPI, userAPI} from "../api/manage.ts";
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
    const [username, setUsername] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
        getConfigAPI(ConfigKeyEnum.USERNAME).then((res: string | null) => {
            setUsername(res ?? '');
        })
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
                                style={{ marginTop: '15px', marginBottom: '15px' }}
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
                            content: <Input ref={inputRef} style={{ marginTop: '15px', marginBottom: '15px' }} />,
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
        }
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
                dataSource={actionTableData}
                pagination={false}
                style={{margin: 4}}
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
                        <Space key={row.key} size='middle'>
                            {row?.actions.map((action: Action) =>
                                action.confirmMessage ? (
                                    <Popconfirm key={action.name} title={`Sure to ${action.name}?`} onConfirm={action.handle}>
                                        <Typography.Link>
                                            {action.name}
                                        </Typography.Link>
                                    </Popconfirm>
                                ) : (
                                    <Typography.Link key={action.name} onClick={action.handle}>
                                        {action.name}
                                    </Typography.Link>
                                )
                            )}
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default ManagePage
