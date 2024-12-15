'use client'

import React, { useEffect, useState} from 'react';
import {Space} from 'antd';
import { getAllPost } from "@/app/api/post";
import {PostDetailVO} from "@/app/model/response";
import AdminPostCard from "@/app/posts/AdminPostCard";

const AdminPostList: React.FC = () => {
    const [list, setList] = useState<PostDetailVO[]>([]);

    useEffect(() => {
        getAllPost(1, 5).then((res: PostDetailVO[]) => {
            setList(res);
        }).then(() => {
        }).catch((reason) => {
            console.log(reason)
        })
    }, []);

    const postCardList: React.JSX.Element[] = list.map(postDetailVO =>
        <AdminPostCard
            key={postDetailVO.id}
            id={postDetailVO.id}
            title={postDetailVO.title}
            cover={postDetailVO.cover}
            content={postDetailVO.content}
            create_time={postDetailVO.create_time}
            update_time={postDetailVO.update_time}
            tag_list={postDetailVO.tag_list}
            category={postDetailVO.category}
            status={postDetailVO.status}
        />
    )

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {postCardList}
        </Space>
    );
};

export default AdminPostList;
