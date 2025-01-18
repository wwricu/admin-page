'use client'

import React from 'react'
import {message, Popconfirm, Space, Table, Typography} from 'antd'
import {databaseAPI} from "../api/common.ts";
import {DatabaseActionEnum} from "../model/enum.ts";

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



const ManagementPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const actionTableData: ActionRow[] = [
        {
            key: '1',
            title: 'Database',
            actions: [
                {
                    name: 'Backup (upload)',
                    handle: () => {databaseAPI(DatabaseActionEnum.BACKUP).then(() => {
                        messageApi.info('Database backup successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override cloud database'
                },
                {
                    name: 'Restore (download)',
                    handle: () => {databaseAPI(DatabaseActionEnum.RESTORE).then(() => {
                        messageApi.info('Database restore successfully.').then()
                    })},
                    confirmMessage: 'Sure to backup database? This will override local database'
                }
            ]
        }
    ]

    return (
        <>
            {contextHolder}
            <Table
                <ActionRow>
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
                        <Space size='middle'>
                            {row?.actions.map((action: Action) =>
                                <Popconfirm title={action.confirmMessage ?? `Sure to ${action.name}?`} onConfirm={action.handle}>
                                    <Typography.Link color='red'>
                                        {action.name}
                                    </Typography.Link>
                                </Popconfirm>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default ManagementPage
