import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderMenu from './SiderMenu';
import AppHeader from './Header';
import { useState } from 'react';

const { Content } = Layout;

export default function MainLayout() {
  // 跟踪侧边栏是否收缩
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  // 处理侧边栏收缩状态变化
  const handleSiderCollapse = (collapsed: boolean) => {
    setSiderCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <SiderMenu onCollapse={handleSiderCollapse} />

      {/* 如果侧边栏收缩，那么左边缘到 80，即展开主页面 */}
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
}
