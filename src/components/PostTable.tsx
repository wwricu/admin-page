'use client'

import React, {useEffect, useState} from 'react'
import {Popconfirm, Space, Table, Tag, Typography} from 'antd'
import {deletePostAPI, getAllPost, updatePostStatusDetailAPI} from '../api/post'
import {PostDetailPageVO, PostDetailVO, TagVO} from '../model/response'
import {PostStatusEnum} from '../model/enum'

const {Column} = Table

interface PostTableProps {
    postStatus: PostStatusEnum
}

const AdminPostPage: React.FC<PostTableProps> = ({postStatus}: PostTableProps) => {
    const [list, setList] = useState<PostDetailVO[]>([])
    const [count, setCount] = useState<number>()
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)

    const updatePostPage = (pageIndex: number = 1, pageSize: number = 10) => {
        setPageIndex(pageIndex)
        setPageSize(pageSize)
        getAllPost(pageIndex, pageSize, postStatus).then((res: PostDetailPageVO) => {
            setList(res?.post_details)
            setCount(res?.count)
        })
    }

    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: pageSize,
        current: pageIndex,
        total: count,
        onChange: updatePostPage,
    }

    useEffect(() => {
        getAllPost(1, pageSize, postStatus).then((res: PostDetailPageVO) => {
            setList(res?.post_details)
            setCount(res?.count)
        })
    }, [pageSize, postStatus])

    return (
        <Table<PostDetailVO>
            style={{margin: 4}}
            dataSource={list}
            rowKey={(postDetailVO: PostDetailVO) => postDetailVO.id}
            pagination={paginationProps}
        >
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
                        <Typography.Link href={`${import.meta.env.BASE_URL}/edit/${postDetailVO.id}`}>
                            Edit
                        </Typography.Link>
                        <Popconfirm
                            title={postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}
                            onConfirm={() => updatePostStatusDetailAPI(postDetailVO.id, postDetailVO.status === 'published' ? PostStatusEnum.DRAFT : PostStatusEnum.PUBLISHED)}
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
