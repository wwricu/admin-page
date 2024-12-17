'use client'

import React, { useEffect, useState} from 'react'
import {Space, Table, Tag} from 'antd'
import { getAllPost } from '@/app/api/post'
import {PostDetailVO} from '@/app/model/response'
import type { TableProps } from 'antd'


const columns: TableProps<PostDetailVO>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Category',
        key: 'category',
        dataIndex: 'category',
        render: (_, { category }) => (
            <Tag color={'blue'}>
                {category?.name.toUpperCase()}
            </Tag>
        ),
    },
    {
        title: 'Tags',
        key: 'tag_list',
        dataIndex: 'tag_list',
        render: (_, { tag_list }) => (
            <>
                {tag_list.map((tag) => {
                    return (
                        <Tag color={'blue'} key={tag.id}>
                            {tag.name.toUpperCase()}
                        </Tag>
                    )
                })}
            </>
        ),
    },
    {
        title: 'Preview',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, postDetailVO) => (
            <Space size='middle'>
                <a href={`/editor?id=${postDetailVO.id}`}>Edit</a>
                <a href={`/editor?id=${postDetailVO.id}`}>{ postDetailVO.status === 'published' ? 'Revoke' : 'Publish' }</a>
                <a href={`/editor?id=${postDetailVO.id}`}>Delete</a>
            </Space>
        ),
    },
]

const AdminPostTable: React.FC = () => {
    const [list, setList] = useState<PostDetailVO[]>([])

    useEffect(() => {
        getAllPost(1, 5).then((res: PostDetailVO[]) => {
            setList(res)
        }).then(() => {
        }).catch((reason) => {
            console.log(reason)
        })
    }, [])

    return (
        <Table<PostDetailVO> columns={columns} dataSource={list} />
    )
}

export default AdminPostTable
