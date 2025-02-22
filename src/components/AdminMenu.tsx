'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
    TagsOutlined,
    MenuOutlined,
} from '@ant-design/icons'
import {Divider, Menu} from 'antd'
import {Link} from "react-router-dom"


const AdminMenu: React.FC = () => {
    return (
        <>
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
                        icon: <MenuOutlined/>,
                        label: <Link to='/management'>Management</Link>,
                    }
                ]}
            />
            <Divider/>
        </>
    )
}

export default AdminMenu
