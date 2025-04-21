import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AppHeader from './Header';

const { Content } = Layout;

import {
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [{
    //埋点管理
    key: 'datamanagement',
    icon: <ProfileOutlined />,
    label: '埋点管理',

    children: [
      //页面
      {
        key: 'modulemanagement',
        label: <Link to="/manage/pagemanage">页面管理</Link>,
      },
      //模块
      {
        key: 'pagemanagement',
        label: <Link to="/manage/modulemanage">模块管理</Link>,
      },
    ],
  },]

const SiderMenu = ({ onCollapse }: { onCollapse: (collapsed: boolean) => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const handleCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
    onCollapse(isCollapsed);
  };
  
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      theme="light"
      width={210}
      collapsedWidth={80}
      style={{
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 64,
        overflow: 'hidden',
        zIndex: 1001,
      }}
    >
      <Menu
        defaultSelectedKeys={['home']}
        mode="inline"
        theme="light"
        items={items}
      />
    </Sider>
  );
};


const TrackPointLayout: React.FC = () => {
  // 和主页面 index.tsx 的实现一样，不再赘述
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  const handleSiderCollapse = (collapsed: boolean) => {
    setSiderCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu onCollapse={handleSiderCollapse} />
      
      <Layout style={{ 
        marginLeft: siderCollapsed ? 80 : 210,
        transition: 'margin-left 0.2s'
      }}>
        {/* 顶部导航栏 */}
        <AppHeader />

        {/* 内容区域 */}
        <Content
          style={{
            marginTop: 64, // 顶部栏高度补偿
            padding: '20px',
            overflow: 'auto', // 内容溢出时显示滚动条
          }}
        >
          <Outlet /> {/* 子路由内容在此处渲染 */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TrackPointLayout;
