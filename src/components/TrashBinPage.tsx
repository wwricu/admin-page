'use client'

import React, {useEffect, useState} from 'react'
import {Button, message, Popconfirm, Space, Table, Tooltip} from 'antd'
import {TrashBinVO} from "../model/response.ts";
import {trashEditAPI, trashGetAllAPI} from "../api/manage.ts";

const {Column} = Table

const TrashBinPage: React.FC = () => {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [trashBinVOList, setTrashBinVOList] = useState<TrashBinVO[]>([])

    const getAllTrashBinVO = () => {
        trashGetAllAPI().then((data: TrashBinVO[]) => {
            setTrashBinVOList(data)
        })
    }

    useEffect(getAllTrashBinVO, [])

    return (
        <>
            {messageContextHolder}
            <Table
                <TrashBinVO>
                className='m-1'
                scroll={{ x: true }}
                dataSource={trashBinVOList}
                rowKey={(trashBinVO: TrashBinVO) => `${trashBinVO.id}:${trashBinVO.type}`}
            >
                <Column
                    <TrashBinVO>
                    title='Name'
                    dataIndex='name'
                    key='name'
                    minWidth={200}
                    render={(_, { name }: TrashBinVO) =>
                        <Tooltip title={name}>
                            <div className='w-50 whitespace-nowrap overflow-hidden text-ellipsis'>
                                {name}
                            </div>
                        </Tooltip>
                    }
                />
                <Column
                    <TrashBinVO>
                    title='Type'
                    dataIndex='type'
                    key='type'
                    minWidth={120}
                />
                <Column
                    <TrashBinVO>
                    title='Delete Time'
                    dataIndex='delete_time'
                    key='delete_time'
                    minWidth={120}
                    render={(_, {delete_time}: TrashBinVO) => delete_time.slice(0, 10)}
                />
                <Column
                    <TrashBinVO>
                    title='Action'
                    key='action'
                    width={100}
                    render={(_, trashBinVO: TrashBinVO) => (
                        <Space size='middle'>
                            <Popconfirm
                                title={`Recover ${trashBinVO.name}?`}
                                onConfirm={() => {
                                    trashEditAPI({
                                        id: trashBinVO.id,
                                        type: trashBinVO.type,
                                        delete: false
                                    }).then(messageApi.info(trashBinVO.id)).then(getAllTrashBinVO)
                                }}
                            >
                                <Button variant='outlined' size='small' color='primary'>
                                    Recover
                                </Button>
                            </Popconfirm>
                            <Popconfirm title={`Delete ${trashBinVO.name}?`} onConfirm={() => {
                                trashEditAPI({
                                    id: trashBinVO.id,
                                    type: trashBinVO.type,
                                    delete: true
                                }).then(messageApi.info(trashBinVO.id)).then(getAllTrashBinVO)
                            }}>
                                <Button variant='solid' size='small' color='danger'>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default TrashBinPage
