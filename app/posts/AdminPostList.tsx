'use client'

import React, { useEffect, useState} from 'react';
import {Row, Space} from 'antd';
import { getAllPost } from "@/app/api/post";
import {PostPreview} from "@/app/model/response";
import AdminPostCard from "@/app/posts/AdminPostCard";

const AdminPostList: React.FC = () => {
    const [data, setData] = useState<PostPreview[]>([]);
    const [list, setList] = useState<PostPreview[]>([]);

    useEffect(() => {
        getAllPost(1, 5).then((res: PostPreview[]) => {
            setData(res);
            setList(res);
        }).then(() => {
        }).catch((reason) => {
            console.log(reason)
        })
    }, []);

    const postCardList: React.JSX.Element[] = list.map(postPreview =>
        <Row key={postPreview.id} justify="center">
            <AdminPostCard
                id={postPreview.id}
                title={postPreview.title}
                cover={postPreview.cover}
                content={postPreview.content}
                create_time={postPreview.create_time}
                update_time={postPreview.update_time}
                tag_list={postPreview.tag_list}
                category={postPreview.category}
                status={postPreview.status}
            />
        </Row>
    )

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {postCardList}
        </Space>
    );
};

export default AdminPostList;
