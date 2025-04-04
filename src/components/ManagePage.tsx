'use client'

import React, {useState} from 'react'
import {message, Popconfirm, Space, Table, Typography} from 'antd'
import {databaseAPI} from "../api/manage.ts";
import {DatabaseActionEnum} from "../model/enum.ts";
import AboutEditor from "./AboutEditor.tsx";
import {baseUrl} from "../api/common.ts";

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
    const [messageApi, contextHolder] = message.useMessage()
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

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
            {contextHolder}
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
                                    <Typography.Link onClick={action.handle}>
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
