'use client'

import React, {useEffect, useState} from 'react'
import {Space, Table, Tag} from 'antd'
import {getAllPost} from '@/app/api/post'
import {PostDetailVO} from '@/app/model/response'

const {Column} = Table


const AdminPostPage: React.FC = () => {
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
        <Table<PostDetailVO> dataSource={list}>
            <Column
                <PostDetailVO>
                title='Title'
                dataIndex='title'
                key='title'
                render={(_, {title}) => <a>{title}</a>}
            />
            <Column
                <PostDetailVO>
                title='Created At'
                dataIndex='create_time'
                key='create_time'
                render={(_, {create_time}) => create_time.slice(0, 10)}
            />
            <Column
                <PostDetailVO>
                title='Category'
                dataIndex='category'
                key='category'
                render={(_, {category}) => (
                    <Tag color={'blue'}>
                        {category?.name.toUpperCase()}
                    </Tag>
                )}
            />
            <Column
                <PostDetailVO>
                title='Tags'
                dataIndex='tag_list'
                key='tag_list'
                render={(_, {tag_list}) => (
                    <>
                        {tag_list.map((tag) => {
                            return (
                                <Tag color={'blue'} key={tag.id}>
                                    {tag.name.toUpperCase()}
                                </Tag>
                            )
                        })}
                    </>
                )}
            />
            <Column
                <PostDetailVO>
                title='Preview'
                dataIndex='content'
                key='content'
            />
            <Column
                <PostDetailVO>
                title='Action'
                key='action'
                render={(_, postDetailVO) => (
                    <Space size='middle'>
                        <a href={`/editor?id=${postDetailVO.id}`}>Edit</a>
                        <a href={`/editor?id=${postDetailVO.id}`}>{postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}</a>
                        <a href={`/editor?id=${postDetailVO.id}`}>Delete</a>
                    </Space>
                )}
            />
        </Table>
    )
}

export default AdminPostPage
