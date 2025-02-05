import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';

const { Header } = Layout;

export default function AppHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 格式化日期（仅显示年月日）
  const formattedTime = currentTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="/profile">
          <Space>
            <UserOutlined /> 个人信息
          </Space>
        </Link>
      ),
    },
    {
      key: 'settings',
      label: (
        <Link to="/settings">
          <Space>
            <SettingOutlined /> 设置
          </Space>
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <Link to="/logout">
          <Space>
            <LogoutOutlined /> 退出登录
          </Space>
        </Link>
      ),
    },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1002,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 左侧：Logo + 分析页面切换菜单（待定） */}
      <div>
        {/* Logo：点击跳转到主页 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/src/img/icon.png" alt="Logo" style={{ height: '60px' }} />
        </div>
      </div>

      {/* 右侧：日期显示和头像下拉菜单 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* 日期显示 */}
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {formattedTime}
        </div>
        {/* 头像及下拉菜单 */}
        <Dropdown menu={{ items }} placement="bottomRight">
          <Typography.Link>
            <Space>
              <Avatar
                style={{ cursor: 'pointer', height: '40px', width: '40px' }}
                src="/avatar.png" // *待替换
              />
              <DownOutlined style={{ fontSize: '10px' }} />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>
    </Header>
  );
}
