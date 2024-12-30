'use client'

import React from 'react'
import {
    BookOutlined,
    BorderlessTableOutlined, EditOutlined,
} from '@ant-design/icons'
import {Button, Divider, Menu} from 'antd'
import {useRouter} from "next/navigation";
import {createPostAPI} from "@/app/api/post";
import {PostDetailVO} from "@/app/model/response";


const AdminMenu: React.FC = () => {
    const router = useRouter()
    const createPost = () => {
        createPostAPI().then((postDetailVO: PostDetailVO) => {
            router.push(`/editor/${postDetailVO.id}`)
        })
    }
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
                        label: <div onClick={() => router.push('/posts')}>Post Management</div>,
                    },
                    {
                        key: '2',
                        icon: <EditOutlined/>,
                        label: <div onClick={() => router.push('/drafts')}>Draft Management</div>,
                    },
                    {
                        key: '3',
                        icon: <BookOutlined/>,
                        label: <div onClick={() => router.push('/category')}>Category Management</div>,
                    },
                    {
                        key: '4',
                        icon: <BorderlessTableOutlined/>,
                        label: <div onClick={() => router.push('/tag')}>Tag Management</div>,
                    }
                ]}
            />
            <Divider/>
            <Button
                style={{width: '100%', marginTop: 10}}
                onClick={createPost}
            >New Post</Button>
        </>


    )
}

export default AdminMenu
