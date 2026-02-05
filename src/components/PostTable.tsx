'use client'

import {useEffect, useState} from 'react'
import {Button, Flex, message, Popconfirm, Table, Tag, Tooltip, Typography} from 'antd'
import {deletePostAPI, getAllPost, updatePostStatusDetailAPI} from '../api/post'
import {PostDetailPageVO, PostDetailVO, TagVO} from '../model/response'
import {PostStatusEnum} from '../model/enum'

const {Column} = Table

export default function AdminPostPage({postStatus}: { postStatus: PostStatusEnum }) {
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
            <Table<PostDetailVO>
                size={'small'}
                scroll={{ x: true }}
                dataSource={list}
                rowKey={(postDetailVO: PostDetailVO) => postDetailVO.id}
                pagination={paginationProps}
            >
                <Column
                    <PostDetailVO>
                    title='Title'
                    dataIndex='title'
                    key='title'
                    render={(_, { title }: PostDetailVO) =>
                        <Tooltip title={title}>
                            <div style={{width: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {title}
                            </div>
                        </Tooltip>
                    }
                />
                <Column
                    <PostDetailVO>
                    title='Created time'
                    dataIndex='create_time'
                    key='create_time'
                    ellipsis={true}
                    width={100}
                    render={(_, {create_time}: PostDetailVO) =>
                        <div style={{whiteSpace: 'nowrap'}}>{create_time.slice(0, 10)}</div>
                    }
                />
                <Column
                    <PostDetailVO>
                    title='Category'
                    dataIndex='category'
                    key='category'
                    width={150}
                    render={(_, { category }: PostDetailVO) =>
                        category ? (
                            <Tag style={{maxWidth: 150, overflow: 'hidden'}} color={'blue'}>
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
                    render={(_, {tag_list}: PostDetailVO) => (
                        <>
                            {tag_list.map((tag: TagVO) => {
                                return (
                                    <Tag style={{overflow: 'hidden'}} color={'blue'} key={tag.id}>
                                        {tag.name.toUpperCase()}
                                    </Tag>
                                )
                            })}
                        </>
                    )}
                />
                <Column
                    <PostDetailVO>
                    title='Action'
                    key='action'
                    width={180}
                    render={(_, postDetailVO: PostDetailVO) => (
                        <Flex justify='space-evenly' gap={'small'}>
                            <Typography.Link href={`/edit/${postDetailVO.id}`}>
                                <Button size={'small'}>
                                    Edit
                                </Button>
                            </Typography.Link>
                            <Popconfirm
                                title={postDetailVO.status === 'published' ? `Revoke "${postDetailVO.title}"` : `Publish "${postDetailVO.title}"`}
                                onConfirm={() => {
                                    updatePostStatusDetailAPI(postDetailVO.id, postDetailVO.status === 'published' ?
                                        PostStatusEnum.DRAFT :
                                        PostStatusEnum.PUBLISHED
                                    ).then(() => {
                                        message.success('success').then()
                                        updatePostPage(pageIndex, pageSize)
                                    })
                                }}
                            >
                                <Button size={'small'}>
                                    {postDetailVO.status === 'published' ? 'Revoke' : 'Publish'}
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title={`Delete ${postDetailVO.status} "${postDetailVO.title}"?`}
                                okButtonProps={{variant: 'solid', color: postDetailVO.status === 'published' ? 'danger' : 'primary'}}
                                onConfirm={() =>
                                    deletePostAPI(postDetailVO.id).then(() => {
                                        message.success('success').then()
                                        updatePostPage(pageIndex, pageSize)
                                    })
                            }>
                                <Button variant='solid' color='danger' size='small'>Delete</Button>
                            </Popconfirm>
                        </Flex>
                    )}
                />
            </Table>
        </div>
    )
}
