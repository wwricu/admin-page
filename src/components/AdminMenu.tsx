import React, {ChangeEvent, useState} from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
    TagsOutlined,
    MenuOutlined,
    DeleteOutlined, PlusOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons'
import {Button, Divider, Flex, Input, Menu, message, Modal, Popover} from 'antd'
import {Link, useLocation, useNavigate} from "react-router-dom"
import {logoutAPI} from "@/api/common.ts"
import {PostDetailVO} from "@/model/response.ts"
import {createPostAPI} from "@/api/post.ts"
import {newTag} from "@/api/tag.ts"
import {TagTypeEnum} from "@/model/enum.ts"
import {useRefresh} from "@/common.ts"

const AdminMenu: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [creatingName, setCreatingName] = useState<'category' | 'tag' | null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [popoverOpen, setPopoverOpen] = useState(false)
    const refresh = useRefresh()
    const activeKey = location.pathname.split('/').filter(Boolean)[0] || ''

    return (
        <Flex style={{minHeight: '100dvh', position: 'sticky', top: 0}} vertical justify='space-between'>
            <Menu
                mode="inline"
                selectedKeys={[activeKey]}
                multiple={false}
                items={[
                    {
                        key: 'create',
                        icon: <PlusOutlined/>,
                        label: 'Create',
                        children: [
                            {
                                key: 'New Post',
                                label: (
                                    <Popover
                                        trigger='click'
                                        open={popoverOpen}
                                        onOpenChange={setPopoverOpen}
                                        content={
                                            <div>
                                                <div style={{marginBottom: 8, height: 22}}>
                                                    <ExclamationCircleFilled style={{height: 22, width: 22, fontSize: 14, color: '#faad14'}}/>
                                                    Create new post?
                                                </div>
                                                <div style={{ textAlign: 'end' }}>
                                                    <Button size='small' onClick={() => setPopoverOpen(false)}>Cancel</Button>
                                                    <Button
                                                        style={{marginLeft: 8}}
                                                        size='small'
                                                        type='primary'
                                                        onClick={() => {
                                                            createPostAPI().then((postDetailVO: PostDetailVO) => {
                                                                navigate(`/edit/${postDetailVO.id}`)
                                                                setPopoverOpen(false)
                                                                message.success('New post created').then()
                                                            }).catch(() => {})
                                                        }}
                                                    >
                                                        OK
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                      >
                                        New Post
                                    </Popover>
                                ),
                                onClick: () => {
                                    if (!popoverOpen) { // TODO: MUST check this or popover cannot be closed inline, but WHY?
                                        setPopoverOpen(true)
                                    }
                                }
                            },
                            {
                                key: 'New Category',
                                label: 'New Category',
                                onClick: () => setCreatingName('category')
                            },
                            {
                                key: 'New Tag',
                                label: 'New Tag',
                                onClick: () => setCreatingName('tag')
                            }
                        ]
                    },
                    {
                        key: 'post',
                        icon: <BookOutlined/>,
                        label: <Link to='/post'>Post</Link>,
                    },
                    {
                        key: 'draft',
                        icon: <EditOutlined/>,
                        label: <Link to='/draft'>Draft</Link>,
                    },
                    {
                        key: 'category',
                        icon: <BorderlessTableOutlined/>,
                        label: <Link to='/category'>Category</Link>,
                    },
                    {
                        key: 'tag',
                        icon: <TagsOutlined/>,
                        label: <Link to='/tag'>Tag</Link>,
                    },
                    {
                        key: 'trash',
                        icon: <DeleteOutlined/>,
                        label: <Link to='/trash'>Trash</Link>,
                    },

                    {
                        key: 'management',
                        icon: <MenuOutlined/>,
                        label: <Link to='/management'>Management</Link>,
                    }
                ]}
            />
            <Flex vertical justify='flex-end'>
                <Divider/>
                <Button style={{marginLeft: 16, marginRight: 16, marginBottom: 20}} onClick={() => logoutAPI().catch(() => {}).then(() => navigate('/login'))}>Logout</Button>
            </Flex>
            <Modal
                title={creatingName === 'category' ? 'New Category' : 'New Tag'}
                closable={false}
                open={creatingName !== null}
                onCancel={() => setCreatingName(null)}
                onOk={() => {
                    if (!inputValue) {
                        message.error('Please enter name', 1).then()
                        return
                    }
                    newTag({ name: inputValue, type: creatingName === 'category' ? TagTypeEnum.POST_CAT : TagTypeEnum.POST_TAG }).then(() => {
                        setInputValue('')
                        message.success('success', 2).then()
                        navigate(`/${creatingName}`)
                        if (creatingName === activeKey) {
                            refresh.triggerRefresh()
                        }
                        setCreatingName(null)
                    }).catch(() => {})
                }}
            >
                <Input
                    value={inputValue}
                    maxLength={32}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setInputValue(e.target.value)}}
                    placeholder={`Input new ${creatingName} name`}
                    style={{ marginTop: 12, marginBottom: 12 }}
                />
            </Modal>
        </Flex>
    )
}

export default AdminMenu
