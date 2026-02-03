'use client'

import React, {ChangeEvent, useEffect, useState} from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
    TagsOutlined,
    MenuOutlined,
    DeleteOutlined, PlusOutlined,
} from '@ant-design/icons'
import {Button, Divider, Flex, Input, Menu, message, Modal, Popconfirm} from 'antd'
import {Link, useLocation, useNavigate} from "react-router-dom"
import {logoutAPI} from "../api/common.ts"
import {PostDetailVO} from "../model/response.ts";
import {createPostAPI} from "../api/post.ts";
import {newTag} from "../api/tag.ts";
import {TagTypeEnum} from "../model/enum.ts";

const AdminMenu: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeKey, setActiveKey] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [creatingName, setCreatingName] = useState<'category' | 'tag' | null>(null)
    const [inputValue, setInputValue] = useState<string>('')

    useEffect(() => {
        setActiveKey(location.pathname.split('/').filter(Boolean)[0] || '')
    }, [location]);

    return (
        <Flex className={'min-h-screen sticky top-0'} vertical justify='space-between'>
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
                                    <Popconfirm
                                        className='w-full'
                                        title="Create a new post?"
                                        onConfirm={() => {
                                            createPostAPI().then((postDetailVO: PostDetailVO) => {
                                                navigate(`/edit/${postDetailVO.id}`)
                                            })
                                        }}
                                    >
                                        <div className={'w-100'}>
                                            New Post
                                        </div>
                                    </Popconfirm>
                                ),
                            },
                            {
                                key: 'New Category',
                                label: 'New Category',
                                onClick: () => {
                                    setCreatingName('category')
                                    setIsModalOpen(true)
                                }
                            },
                            {
                                key: 'New Tag',
                                label: 'New Tag',
                                onClick: () => {
                                    setCreatingName('tag')
                                    setIsModalOpen(true)
                                }
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
                <Divider className='mb-0'/>
                <Button className='mx-4 mb-5' onClick={() => logoutAPI().then(() => navigate('/login'))}>Logout</Button>
            </Flex>
            <Modal
                closable={false}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    if (!inputValue) {
                        message.error('Please enter name', 1).then()
                        return
                    }
                    const type = creatingName === 'category' ? TagTypeEnum.POST_CAT : TagTypeEnum.POST_TAG
                    newTag({ name: inputValue, type: type }).then(() => {
                        setInputValue('')
                        setIsModalOpen(false)
                        message.success('success', 2).then()
                        navigate(`/${creatingName}`)
                    })
                }}
            >
                <Input
                    value={inputValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setInputValue(e.target.value)}}
                    placeholder={`Input new ${creatingName} name`}
                    className={'my-2'}>
                </Input>
            </Modal>
        </Flex>
    )
}

export default AdminMenu
