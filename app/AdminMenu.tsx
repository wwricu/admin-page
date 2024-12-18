'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
} from '@ant-design/icons'
import {Menu} from 'antd'
import {useRouter} from "next/navigation";


const AdminMenu: React.FC = () => {
    const router = useRouter()
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            theme="dark"
            items={[
                {
                    key: '1',
                    icon: <BookOutlined/>,
                    label: <div onClick={() => router.push('/posts')}>Post Management</div>,
                },
                {
                    key: '2',
                    icon: <BorderlessTableOutlined/>,
                    label: <div onClick={() => router.push('/tag')}>Tag Management</div>,
                },
                {
                    key: '3',
                    icon: <BorderlessTableOutlined/>,
                    label: <div onClick={() => router.push('/category')}>Category Management</div>,
                },
                {
                    key: '4',
                    icon: <EditOutlined/>,
                    label: <div onClick={() => router.push('/new-post')}>New Post</div>,
                },
            ]}
        />
    )
}

export default AdminMenu
