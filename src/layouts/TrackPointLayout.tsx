import { Layout,Menu } from 'antd';
import { Outlet,Link } from 'react-router-dom';
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

const SiderMenu = () => {
  return (
    <Sider
      collapsible
      theme="light"
      width={210}
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


export default function TrackPointLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      
    <SiderMenu />
      <Layout style={{ marginLeft: 200 }}>
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
}
