import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  SwitcherOutlined,
  LineChartOutlined,
  UserOutlined,
  SlidersOutlined,
  FundViewOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'home',
    icon: <SwitcherOutlined />,
    label: <Link to="/">数据总览</Link>,
  },
  {
    key: 'trendanalysis',
    icon: <LineChartOutlined />,
    label: <Link to="/trendanalysis">趋势分析</Link>,
  },
  {
    key: 'visitoranalysis',
    icon: <UserOutlined />,
    label: '访客分析',
    children: [
      {
        key: 'regionalanalysis',
        label: <Link to="/visitoranalysis/regionalanalysis">地域分析</Link>,
      },
      {
        key: 'deviceanalysis',
        label: <Link to="/visitoranalysis/useranalysis">新老访客</Link>,
      },
    ],
  },
  {
    key: 'visitanalysis',
    icon: <SlidersOutlined />,
    label: '访问分析',
    children: [
      {
        key: 'pageanalysis',
        label: <Link to="/visitanalysis/visited">受访页面</Link>,
      },
      {
        key: 'entryanalysis',
        label: <Link to="/visitanalysis/entrance">入口页面</Link>,
      },
    ],
  },
  {
    key: 'performanceanalysis',
    icon: <FundViewOutlined />,
    label: <Link to="/performanceanalysis">性能分析</Link>,
  },
  {
    key: 'eventanalysis',
    icon: <ReconciliationOutlined />,
    label: <Link to="/eventanalysis">事件分析</Link>,
  },
];

const pathToKeyMap: { [path: string]: string } = {
  '/': 'home',
  '/trendanalysis': 'trendanalysis',
  '/visitoranalysis/regionalanalysis': 'regionalanalysis',
  '/visitoranalysis/useranalysis': 'deviceanalysis',
  '/visitanalysis/visited': 'pageanalysis',
  '/visitanalysis/entrance': 'entryanalysis',
  '/performanceanalysis': 'performanceanalysis',
  '/eventanalysis': 'eventanalysis',
};

// 要向父组件传递收缩状态，使得主页面得知收缩状态後也要收缩
interface SiderMenuProps {
  onCollapse?: (collapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderMenuProps> = ({ onCollapse }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const key = pathToKeyMap[location.pathname] || 'home';
    setSelectedKeys([key]);
  }, [location.pathname]);

  // 处理收缩状态变化
  const handleCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
    if (onCollapse) {
      onCollapse(isCollapsed);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      theme="light"
      width={210}          // 展开的宽度
      collapsedWidth={80}  // 收缩的宽度
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
        selectedKeys={selectedKeys}
        mode="inline"
        theme="light"
        items={items}
      />
    </Sider>
  );
};

export default SiderMenu;
