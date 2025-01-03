'use client'

import React, {useEffect, useState} from 'react'
import {Popconfirm, Space, Table, Tag, Typography} from 'antd'
import {deletePostAPI, getAllPost, updatePostStatusDetailAPI} from '../api/post'
import {PostDetailVO, TagVO} from '../model/response'
import {PostStatusEnum} from '../model/enum'

const {Column} = Table

interface PostTableProps {
    postStatus: PostStatusEnum
}

const AdminPostPage: React.FC<PostTableProps> = ({postStatus}: PostTableProps) => {
    const [list, setList] = useState<PostDetailVO[]>([])

    useEffect(() => {
        getAllPost(1, 5, postStatus).then((res: PostDetailVO[]) => {
            setList(res)
        }).catch((reason) => {
            console.log(reason)
        })
    }, [postStatus])

    return (
        <Table<PostDetailVO> dataSource={list} rowKey={(postDetailVO: PostDetailVO) => postDetailVO.id}>
            <Column
                <PostDetailVO>
                title='Title'
                dataIndex='title'
                key='title'
            />
            <Column
                <PostDetailVO>
                title='Created At'
                dataIndex='create_time'
                key='create_time'
                render={(_, {create_time}: PostDetailVO) => create_time.slice(0, 10)}
            />
            <Column
                <PostDetailVO>
                title='Category'
                dataIndex='category'
                key='category'
                render={(_, {category}: PostDetailVO) => (
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
                render={(_, {tag_list}: PostDetailVO) => (
                    <>
                        {tag_list.map((tag: TagVO) => {
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
                dataIndex='preview'
                key='preview'
            />
            <Column
                <PostDetailVO>
                title='Action'
                key='action'
                render={(_, postDetailVO: PostDetailVO) => (
                    <Space size='middle'>
                        <Typography.Link href={`/editor/${postDetailVO.id}`}>
                            Edit
                        </Typography.Link>
                        <Popconfirm
                            title={postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}
                            onConfirm={() => updatePostStatusDetailAPI(postDetailVO.id, postDetailVO.status as PostStatusEnum)}
                        >
                            <Typography.Link color='red'>
                                {postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}
                            </Typography.Link>
                        </Popconfirm>
                        <Popconfirm title="Sure to Delete?" onConfirm={() => deletePostAPI(postDetailVO.id)}>
                            <Typography.Link color='red'>
                                Delete
                            </Typography.Link>
                        </Popconfirm>
                    </Space>
                )}
            />
        </Table>
    )
}

export default AdminPostPage
