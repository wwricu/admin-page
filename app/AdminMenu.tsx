import React from 'react';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {Menu} from 'antd';


const AdminMenu: React.FC = () => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
                {
                    key: '1',
                    icon: <VideoCameraOutlined />,
                    label: <a href='/new-post'>New Post</a>,
                },
                {
                    key: '2',
                    icon: <VideoCameraOutlined />,
                    label: <a href='/posts'>Post Management</a>,
                },
                {
                    key: '3',
                    icon: <UploadOutlined />,
                    label: <a href='/tags'>Tag Management</a>,
                },
                {
                    key: '4',
                    icon: <UploadOutlined />,
                    label: <a href='/editor'>Editor</a>,
                }
            ]}
        />
    );
};

export default AdminMenu;