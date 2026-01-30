'use client'

import React, {useEffect, useState} from 'react'
import {Flex, message, Popconfirm, Table, Typography} from 'antd'
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
                dataSource={trashBinVOList}
                rowKey={(trashBinVO: TrashBinVO) => `${trashBinVO.id}:${trashBinVO.type}`}
            >
                <Column
                    <TrashBinVO>
                    title='Name'
                    dataIndex='name'
                    key='name'
                    width={200}
                />
                <Column
                    <TrashBinVO>
                    title='Type'
                    dataIndex='type'
                    key='type'
                    width={200}
                />
                <Column
                    <TrashBinVO>
                    title='Delete Time'
                    dataIndex='delete_time'
                    key='delete_time'
                    width={200}
                    render={(_, {delete_time}: TrashBinVO) => delete_time.slice(0, 10)}
                />
                <Column
                    <TrashBinVO>
                    title='Action'
                    key='action'
                    width={100}
                    render={(_, trashBinVO: TrashBinVO) => (
                        <Flex justify='space-evenly' className='flex-nowrap'>
                            <Popconfirm
                                title='Sure to recover?'
                                onConfirm={() => {
                                    trashEditAPI({
                                        id: trashBinVO.id,
                                        type: trashBinVO.type,
                                        delete: false
                                    }).then(messageApi.info(trashBinVO.id)).then(getAllTrashBinVO)
                                }}
                            >
                                <Typography.Link>
                                    Recover
                                </Typography.Link>
                            </Popconfirm>
                            <Popconfirm title="Sure to Delete?" onConfirm={() => {
                                trashEditAPI({
                                    id: trashBinVO.id,
                                    type: trashBinVO.type,
                                    delete: true
                                }).then(messageApi.info(trashBinVO.id)).then(getAllTrashBinVO)
                            }}>
                                <Typography.Link>
                                    Delete
                                </Typography.Link>
                            </Popconfirm>
                        </Flex>
                    )}
                />
            </Table>
        </>
    )
}

export default TrashBinPage
