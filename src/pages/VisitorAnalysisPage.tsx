import React, { useState, useEffect } from 'react';
import { Radio, Layout, DatePicker, Card, Row, Col, Statistic } from 'antd';
import type { RadioChangeEvent, DatePickerProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import type { Dayjs } from 'dayjs';
import axios from 'axios';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Content } = Layout;

export default function UserAnalysisPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [userType, setUserType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 示例数据
  const [userData, setUserData] = useState({
    activeUsers: 1234,
    newUsers: 456,
    totalPageViews: 5678,
    avgSessionDuration: '5:30',
    timeSeriesData: [
      { time: '00:00', users: 30 },
      { time: '04:00', users: 20 },
      { time: '08:00', users: 80 },
      { time: '12:00', users: 100 },
      { time: '16:00', users: 90 },
      { time: '20:00', users: 70 },
    ],
    userBehavior: [
      { name: '浏览页面', value: 400 },
      { name: '点击按钮', value: 300 },
      { name: '表单提交', value: 200 },
      { name: '下载文件', value: 100 },
    ],
  });

  useEffect(() => {
    // 初始化折线图
    const lineChart = echarts.init(document.getElementById('userTrendChart'));
    const lineOption = {
      title: {
        text: '用户活跃趋势',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: userData.timeSeriesData.map((item) => item.time),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: userData.timeSeriesData.map((item) => item.users),
          type: 'line',
          smooth: true,
        },
      ],
    };
    lineChart.setOption(lineOption);

    // 初始化饼图
    const pieChart = echarts.init(document.getElementById('userBehaviorChart'));
    const pieOption = {
      title: {
        text: '用户行为分布',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '用户行为',
          type: 'pie',
          radius: '50%',
          data: userData.userBehavior,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    pieChart.setOption(pieOption);

    // 清理函数
    return () => {
      lineChart.dispose();
      pieChart.dispose();
    };
  }, [userData]);

  const onTimeRangeChange = (e: RadioChangeEvent) => {
    setTimeRange(e.target.value);
  };

  const onUserTypeChange = (e: RadioChangeEvent) => {
    setUserType(e.target.value);
  };

  return (
    <div>
      {/* 固定 Header */}
      <div
        style={{
          position: 'fixed',
          top: 65,
          width: '100%',
          zIndex: 1,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>时间范围：</span>
          <Radio.Group value={timeRange} onChange={onTimeRangeChange}>
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="yesterday">昨日</Radio.Button>
            <Radio.Button value="week">近7天</Radio.Button>
            <Radio.Button value="month">近30天</Radio.Button>
          </Radio.Group>
          <RangePicker style={{ marginLeft: 16 }} />
        </div>

        <div>
          <span style={{ marginRight: 8 }}>用户类型：</span>
          <Radio.Group value={userType} onChange={onUserTypeChange}>
            <Radio.Button value="all">全部用户</Radio.Button>
            <Radio.Button value="new">新用户</Radio.Button>
            <Radio.Button value="returning">老用户</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* 内容区域 */}
      <Content style={{ marginTop: 140, padding: '0 24px' }}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="活跃用户" value={userData.activeUsers} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="新增用户" value={userData.newUsers} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="页面浏览量" value={userData.totalPageViews} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均会话时长"
                value={userData.avgSessionDuration}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col span={16}>
            <Card>
              <div id="userTrendChart" style={{ height: '400px' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div id="userBehaviorChart" style={{ height: '400px' }} />
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  );
}
