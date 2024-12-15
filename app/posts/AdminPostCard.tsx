'use client'

import React from 'react';
import {Card} from 'antd';
import {PostPreview} from "@/app/model/response";


const AdminPostCard: React.FC<PostPreview> = (postPreview: PostPreview) => {
    return (
        <Card title={postPreview.title} extra={<a href={`/editor?id=${postPreview.id}`}>Edit</a>} style={{ width: '100%' }}>
            <p>{postPreview.content}</p>
            <p>{postPreview.create_time}</p>
            <p>{postPreview.update_time}</p>
            <p>{postPreview.status}</p>
        </Card>
    );
};

export default AdminPostCard;
