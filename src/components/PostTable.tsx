'use client'

import React, {useEffect, useState} from 'react'
import {Button, Flex, Popconfirm, Table, Tag, Typography} from 'antd'
import {createPostAPI, deletePostAPI, getAllPost, updatePostStatusDetailAPI} from '../api/post'
import {PostDetailPageVO, PostDetailVO, TagVO} from '../model/response'
import {PostStatusEnum} from '../model/enum'
import {useNavigate} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";

const {Column} = Table

interface PostTableProps {
    postStatus: PostStatusEnum
}

const AdminPostPage: React.FC<PostTableProps> = ({postStatus}: PostTableProps) => {
    const navigate = useNavigate()
    const [list, setList] = useState<PostDetailVO[]>([])
    const [count, setCount] = useState<number>()
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)

    const updatePostPage = (pageIndex: number = 1, pageSize: number = 10) => {
        setPageIndex(pageIndex)
        setPageSize(pageSize)
        getAllPost(pageIndex, pageSize, postStatus).then((res: PostDetailPageVO) => {
            setList(res?.data)
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
            setList(res?.data)
            setCount(res?.count)
        })
    }, [pageSize, postStatus])

    return (
        <div>
            <Button
                style={{marginTop: 4, marginLeft: 4}} type='primary'
                onClick={() => {createPostAPI().then((postDetailVO: PostDetailVO) => {
                    navigate(`/edit/${postDetailVO.id}`)
                })}}
            >
                <PlusOutlined/>New Post
            </Button>
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
                    width={200}
                />
                <Column
                    <PostDetailVO>
                    title='Created At'
                    dataIndex='create_time'
                    key='create_time'
                    width={120}
                    render={(_, {create_time}: PostDetailVO) => create_time.slice(0, 10)}
                />
                <Column
                    <PostDetailVO>
                    title='Category'
                    dataIndex='category'
                    key='category'
                    width={200}
                    render={(_, {category}: PostDetailVO) =>
                        category ? (
                            <Tag color={'blue'} style={{maxWidth: 150, overflow: 'hidden'}}>
                                {category.name.toUpperCase()}
                            </Tag>
                        ) : <></>
                    }
                />
                <Column
                    <PostDetailVO>
                    title='Tags'
                    dataIndex='tag_list'
                    key='tag_list'
                    width={300}
                    render={(_, {tag_list}: PostDetailVO) => (
                        <>
                            {tag_list.map((tag: TagVO) => {
                                return (
                                    <Tag color={'blue'} key={tag.id} style={{maxWidth: 200, overflow: 'hidden'}}>
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
                    render={(_, {preview}: PostDetailVO) => (
                        <Typography.Text>{preview}</Typography.Text>
                    )}
                />
                <Column
                    <PostDetailVO>
                    title='Action'
                    key='action'
                    width={180}
                    render={(_, postDetailVO: PostDetailVO) => (
                        <Flex justify='space-evenly' style={{flexWrap: 'wrap'}}>
                            <Typography.Link href={`/edit/${postDetailVO.id}`}>
                                Edit
                            </Typography.Link>
                            <Popconfirm
                                title={postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}
                                onConfirm={() => {
                                    updatePostStatusDetailAPI(postDetailVO.id, postDetailVO.status === 'published' ?
                                        PostStatusEnum.DRAFT :
                                        PostStatusEnum.PUBLISHED
                                    ).then(_ => updatePostPage(pageIndex, pageSize))
                                }}
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
                        </Flex>
                    )}
                />
            </Table>
        </div>
    )
}

export default AdminPostPage
