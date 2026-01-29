'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
    TagsOutlined,
    MenuOutlined,
    DeleteOutlined, PlusOutlined,
} from '@ant-design/icons'
import {Button, Divider, Flex, Menu, Popconfirm} from 'antd'
import {Link, useNavigate} from "react-router-dom"
import {logoutAPI} from "../api/common.ts"
import {PostDetailVO} from "../model/response.ts";
import {createPostAPI} from "../api/post.ts";


const AdminMenu: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Flex className={'min-h-screen sticky top-0'} vertical justify='space-between'>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                theme='light'
                items={[
                    {
                        key: 'Create',
                        icon: <PlusOutlined/>,
                        label: 'Create',
                        children: [
                            {
                                key: 'New Post',
                                label: (
                                    <Popconfirm
                                        className={'w-full'}
                                        title="Create a new post?"
                                        onConfirm={() => {
                                            createPostAPI().then((postDetailVO: PostDetailVO) => {
                                                navigate(`/edit/${postDetailVO.id}`)
                                            })
                                        }}
                                    >
                                        <p>New Post</p>
                                    </Popconfirm>
                                ),
                            },
                            {
                                key: 'New Category',
                                label: (
                                    <div>New Category</div>
                                ),
                            },
                            {
                                key: 'New Tag',
                                label: (
                                    <div>New Tag</div>
                                ),
                            }
                        ]
                    },
                    {
                        key: '1',
                        icon: <BookOutlined/>,
                        label: <Link to='/post'>Post</Link>,
                    },
                    {
                        key: '2',
                        icon: <EditOutlined/>,
                        label: <Link to='/draft'>Draft</Link>,
                    },
                    {
                        key: '3',
                        icon: <BorderlessTableOutlined/>,
                        label: <Link to='/category'>Category</Link>,
                    },
                    {
                        key: '4',
                        icon: <TagsOutlined/>,
                        label: <Link to='/tag'>Tag</Link>,
                    },
                    {
                        key: '5',
                        icon: <DeleteOutlined/>,
                        label: <Link to='/trash'>Trash</Link>,
                    },

                    {
                        key: '6',
                        icon: <MenuOutlined/>,
                        label: <Link to='/management'>Management</Link>,
                    }
                ]}
            />
            <Flex vertical justify='flex-end'>
                <Divider style={{marginBottom: 0}}/>
                <Button onClick={() => logoutAPI().then(() => navigate('/login'))} style={{margin: 16}}>Logout</Button>
            </Flex>
        </Flex>
    )
}

export default AdminMenu
