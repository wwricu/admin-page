import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = []

const AdminHeader: React.FC = () => {
    return <Menu mode="horizontal" items={items} />
}

export default AdminHeader;
