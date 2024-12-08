'use client'

import React, { useEffect, useState } from 'react';
import { List, Skeleton } from 'antd';
import { getAllPost } from "@/app/api/post";
import {PostPreview} from "@/app/model/response";

interface DataType {
    gender?: string;
    name: {
        title?: string;
        first?: string;
        last?: string;
    };
    email?: string;
    picture: {
        large?: string;
        medium?: string;
        thumbnail?: string;
    };
    nat?: string;
    loading: boolean;
}


const AdminPostList: React.FC = () => {
    const [initLoading, setInitLoading] = useState(true);
    const [data, setData] = useState<PostPreview[]>([]);
    const [list, setList] = useState<PostPreview[]>([]);

    useEffect(() => {
        getAllPost(1, 5).then((res: PostPreview[]) => {
            setInitLoading(false);
            setData(res);
            setList(res);
        }).then(() => {
            console.log(JSON.stringify(data))
        }).catch((reason) => {
            console.log(reason)
        })
    }, []);

    return (
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={list}
            style={{ padding: 24 }}
            renderItem={(item) => (
                <List.Item>
                    <Skeleton avatar title={false} loading={initLoading} active>
                        <List.Item.Meta
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={item.content}
                        />
                    </Skeleton>
                </List.Item>
            )}
        />
    );
};

export default AdminPostList;
