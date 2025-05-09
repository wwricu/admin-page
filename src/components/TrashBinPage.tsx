'use client'

import React, {useEffect, useState} from 'react'
import {Flex, message, Popconfirm, Table, Typography} from 'antd'
import {TrashBinVO} from "../model/response.ts";
import {trashEditAPI, trashGetAllAPI} from "../api/manage.ts";

const {Column} = Table



const TrashBinPage: React.FC = () => {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [trashBinVOList, setTrashBinVOList] = useState<TrashBinVO[]>([])

    useEffect(() => {
        trashGetAllAPI().then((data: TrashBinVO[]) => {
            setTrashBinVOList(data)
        })
    }, [])


    return (
        <>
            {messageContextHolder}
            <Table
                <TrashBinVO>
                style={{margin: 4}}
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
                    title='Deleted Time'
                    dataIndex='deleted_time'
                    key='deleted_time'
                    width={200}
                />
                <Column
                    <TrashBinVO>
                    title='Action'
                    key='action'
                    width={180}
                    render={(_, trashBinVO: TrashBinVO) => (
                        <Flex justify='space-evenly' style={{flexWrap: 'wrap'}}>
                            <Popconfirm
                                title='Sure to recover?'
                                onConfirm={() => {
                                    trashEditAPI({
                                        id: trashBinVO.id,
                                        type: trashBinVO.type,
                                        delete: false
                                    }).then(messageApi.success(trashBinVO.id)).then()
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
                                }).then(messageApi.success(trashBinVO.id)).then()
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
