'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
} from '@ant-design/icons'
import {Button, Divider, Menu} from 'antd'
import {createPostAPI} from "../api/post"
import {PostDetailVO} from "../model/response"
import {Link, useNavigate} from "react-router-dom"


const AdminMenu: React.FC = () => {
    const navigate = useNavigate()
    return (
        <>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                theme="light"
                items={[
                    {
                        key: '1',
                        icon: <EditOutlined/>,
                        label: <Link to='/post'>Post</Link>,
                    },
                    {
                        key: '2',
                        icon: <EditOutlined/>,
                        label: <Link to='/draft'>Draft</Link>,
                    },
                    {
                        key: '3',
                        icon: <BookOutlined/>,
                        label: <Link to='/category'>Category</Link>,
                    },
                    {
                        key: '4',
                        icon: <BorderlessTableOutlined/>,
                        label: <Link to='/tag'>Tag</Link>,
                    }
                ]}
            />
            <Divider/>
            <Button
                style={{width: '100%', marginTop: 10}}
                onClick={() => {createPostAPI().then((postDetailVO: PostDetailVO) => {
                    navigate(`/edit/${postDetailVO.id}`)
                })}}
            >New Post</Button>
        </>


    )
}

export default AdminMenu
