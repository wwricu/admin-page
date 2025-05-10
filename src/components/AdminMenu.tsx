'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
    TagsOutlined,
    MenuOutlined,
    DeleteOutlined,
} from '@ant-design/icons'
import {Button, Divider, Flex, Menu} from 'antd'
import {Link, useNavigate} from "react-router-dom"
import {logoutAPI} from "../api/common.ts";


const AdminMenu: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Flex vertical justify='space-between' style={{minHeight: '100vh'}}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                theme='light'
                items={[
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
            <Divider/>
            <Button onClick={() => logoutAPI().then(() => navigate('/login'))} style={{margin: 16}}>Logout</Button>
        </Flex>
    )
}

export default AdminMenu
