'use client'

import React from 'react';
import {Card} from 'antd';
import {PostDetailVO} from "@/app/model/response";


const AdminPostCard: React.FC<PostDetailVO> = (postDetailVO: PostDetailVO) => {
    return (
        <Card title={postDetailVO.title} extra={<a href={`/editor?id=${postDetailVO.id}`}>Edit</a>} style={{ width: '100%' }}>
            <p>{postDetailVO.content}</p>
            <p>{postDetailVO.create_time}</p>
            <p>{postDetailVO.update_time}</p>
            <p>{postDetailVO.status}</p>
        </Card>
    );
};

export default AdminPostCard;
