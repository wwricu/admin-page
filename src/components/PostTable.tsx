import {useEffect, useRef, useState} from 'react'
import {Button, Flex, message, Popconfirm, Table, Tag, Tooltip} from 'antd'
import {deletePostAPI, getAllPost, updatePostStatusDetailAPI} from '@/api/post'
import {PageVO, PostPreviewVO, TagVO} from '@/model/response'
import {PostStatusEnum} from '@/model/enum'
import {useNavigate} from 'react-router-dom'

const {Column} = Table

export default function AdminPostPage({postStatus}: { postStatus: PostStatusEnum }) {
    const [list, setList] = useState<PostPreviewVO[]>([])
    const [count, setCount] = useState<number>()
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const navigate = useNavigate()

    const updatePostPage = (pageIndex: number = 1, pageSize: number = 10) => {
        setPageIndex(pageIndex)
        setPageSize(pageSize)
        setLoading(true)
        getAllPost(pageIndex, pageSize, postStatus).then((res: PageVO<PostPreviewVO>) => {
            setList(res.data)
            setCount(res.count)
        }).catch(() => {
            // Error toast is raised centrally in http layer
        }).finally(() => setLoading(false))
    }

    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: pageSize,
        current: pageIndex,
        total: count,
        onChange: updatePostPage,
    }

    // Only refetch on status tab switch; page/pageSize changes go through pagination.onChange
    const pageSizeRef = useRef(pageSize)
    pageSizeRef.current = pageSize
    useEffect(() => {
        document.title = `Admin - ${postStatus === PostStatusEnum.PUBLISHED ? 'Published Posts' : 'Draft Posts'} - wwr.icu`
        updatePostPage(1, pageSizeRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postStatus])

    return (
        <div>
            <Table<PostPreviewVO>
                size={'small'}
                scroll={{ x: true }}
                loading={loading}
                dataSource={list}
                rowKey={(postDetailVO: PostPreviewVO) => postDetailVO.id}
                pagination={paginationProps}
            >
                <Column
                    <PostPreviewVO>
                    title='Title'
                    dataIndex='title'
                    key='title'
                    render={(_, { title }: PostPreviewVO) =>
                        <Tooltip title={title}>
                            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {title}
                            </div>
                        </Tooltip>
                    }
                />
                <Column
                    <PostPreviewVO>
                    title='Created time'
                    dataIndex='create_time'
                    key='create_time'
                    ellipsis={true}
                    width={100}
                    render={(_, {create_time}: PostPreviewVO) =>
                        <div style={{whiteSpace: 'nowrap'}}>{create_time?.slice(0, 10)}</div>
                    }
                />
                <Column
                    <PostPreviewVO>
                    title='Category'
                    dataIndex='category'
                    key='category'
                    width={150}
                    render={(_, { category }: PostPreviewVO) =>
                        category ? (
                            <Tag style={{maxWidth: 150, overflow: 'hidden'}} color={'blue'}>
                                {category.name.toUpperCase()}
                            </Tag>
                        ) : <></>
                    }
                />
                <Column
                    <PostPreviewVO>
                    title='Tags'
                    dataIndex='tag_list'
                    key='tag_list'
                    render={(_, {tag_list}: PostPreviewVO) => (
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
                    <PostPreviewVO>
                    title='Action'
                    key='action'
                    width={180}
                    render={(_, postDetailVO: PostPreviewVO) => (
                        <Flex justify='space-evenly' gap={'small'}>
                            <Button size={'small'} onClick={() => navigate(`/edit/${postDetailVO.id}`)}>
                                Edit
                            </Button>
                            <Popconfirm
                                title={postDetailVO.status === PostStatusEnum.PUBLISHED ? `Revoke "${postDetailVO.title}"` : `Publish "${postDetailVO.title}"`}
                                onConfirm={() => {
                                    updatePostStatusDetailAPI(postDetailVO.id, postDetailVO.status === PostStatusEnum.PUBLISHED ?
                                        PostStatusEnum.DRAFT :
                                        PostStatusEnum.PUBLISHED
                                    ).then(() => {
                                        message.success('success').then()
                                        updatePostPage(pageIndex, pageSize)
                                    }).catch(() => {})
                                }}
                            >
                                <Button size={'small'}>
                                    {postDetailVO.status === PostStatusEnum.PUBLISHED ? 'Revoke' : 'Publish'}
                                </Button>
                            </Popconfirm>
                            {
                                postDetailVO.status === PostStatusEnum.PUBLISHED ? null :
                                <Popconfirm
                                    title={`Delete ${postDetailVO.status} "${postDetailVO.title}"?`}
                                    okButtonProps={{variant: 'solid', color: 'danger'}}
                                    onConfirm={() =>
                                        deletePostAPI(postDetailVO.id).then(() => {
                                            message.success('success').then()
                                            updatePostPage(pageIndex, pageSize)
                                        }).catch(() => {})
                                }>
                                    <Button variant='solid' color='danger' size='small'>Delete</Button>
                                </Popconfirm>
                            }
                        </Flex>
                    )}
                />
            </Table>
        </div>
    )
}
