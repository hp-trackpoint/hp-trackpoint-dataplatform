import React, { useState, useEffect } from 'react';
import {
  Radio,
  Layout,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import * as echarts from 'echarts';
import {
  UserOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Content } = Layout;

export default function VisitAnalysisPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);

  // 示例数据
  const visitData = {
    totalVisits: 12345,
    avgDuration: '00:05:30',
    bounceRate: '35.8%',
    avgPageViews: 4.5,
    hourlyData: [
      { hour: '00:00', visits: 120, duration: 289, pages: 3.2 },
      { hour: '02:00', visits: 80, duration: 267, pages: 3.1 },
      { hour: '04:00', visits: 60, duration: 234, pages: 2.8 },
      { hour: '06:00', visits: 100, duration: 278, pages: 3.3 },
      { hour: '08:00', visits: 280, duration: 321, pages: 4.1 },
      { hour: '10:00', visits: 460, duration: 356, pages: 4.8 },
      { hour: '12:00', visits: 380, duration: 340, pages: 4.5 },
      { hour: '14:00', visits: 420, duration: 350, pages: 4.6 },
      { hour: '16:00', visits: 520, duration: 365, pages: 4.9 },
      { hour: '18:00', visits: 480, duration: 358, pages: 4.7 },
      { hour: '20:00', visits: 280, duration: 310, pages: 3.8 },
      { hour: '22:00', visits: 180, duration: 290, pages: 3.4 },
    ],
    sourceData: [
      { value: 1048, name: '直接访问' },
      { value: 735, name: '搜索引擎' },
      { value: 580, name: '外部链接' },
      { value: 484, name: '社交媒体' },
      { value: 300, name: '其他来源' },
    ],
    pageDepth: [
      { value: 40, name: '1页' },
      { value: 25, name: '2 - 3页' },
      { value: 20, name: '4 - 6页' },
      { value: 10, name: '7 - 9页' },
      { value: 5, name: '10页以上' },
    ],
  };

  useEffect(() => {
    // 访问趋势图
    const trendChart = echarts.init(document.getElementById('visitTrendChart'));
    const trendOption = {
      title: {
        text: '访问趋势分析',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['访问量', '平均访问时长', '平均页面浏览量'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: visitData.hourlyData.map((item) => item.hour),
      },
      yAxis: [
        {
          type: 'value',
          name: '访问量',
        },
        {
          type: 'value',
          name: '时长/页面数',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          data: visitData.hourlyData.map((item) => item.visits),
          itemStyle: {
            color: '#1890ff',
          },
        },
        {
          name: '平均访问时长',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: visitData.hourlyData.map((item) => item.duration),
          itemStyle: {
            color: '#52c41a',
          },
        },
        {
          name: '平均页面浏览量',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: visitData.hourlyData.map((item) => item.pages),
          itemStyle: {
            color: '#faad14',
          },
        },
      ],
    };
    trendChart.setOption(trendOption);

    // 访问来源图
    const sourceChart = echarts.init(
      document.getElementById('visitSourceChart')
    );
    const sourceOption = {
      title: {
        text: '访问来源分布',
        left: 'center',
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
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: visitData.sourceData,
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
    sourceChart.setOption(sourceOption);

    // 访问深度图
    const depthChart = echarts.init(document.getElementById('visitDepthChart'));
    const depthOption = {
      title: {
        text: '访问深度分析',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问深度',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: visitData.pageDepth,
        },
      ],
    };
    depthChart.setOption(depthOption);

    // 清理函数
    return () => {
      trendChart.dispose();
      sourceChart.dispose();
      depthChart.dispose();
    };
  }, []);

  const onTimeRangeChange = (e: RadioChangeEvent) => {
    setTimeRange(e.target.value);
  };

  return (
    <div>
      {/* 固定 Header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          padding: '16px',
          borderBottom: '1px solid #e8e8e8',
          zIndex: 1,
        }}
      >
        <Radio.Group value={timeRange} onChange={onTimeRangeChange}>
          <Radio value="today">今日</Radio>
          <Radio value="yesterday">昨日</Radio>
          <Radio value="thisWeek">本周</Radio>
          <Radio value="lastWeek">上周</Radio>
          <Radio value="thisMonth">本月</Radio>
          <Radio value="lastMonth">上月</Radio>
        </Radio.Group>
        <RangePicker style={{ marginLeft: '16px' }} />
      </div>
      <Content style={{ padding: '16px', marginTop: '64px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总访问量"
                value={visitData.totalVisits}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均访问时长"
                value={visitData.avgDuration}
                prefix={<FieldTimeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="跳出率"
                value={visitData.bounceRate}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均页面浏览量"
                value={visitData.avgPageViews}
                prefix={<GlobalOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={16}>
            <Card title="访问趋势分析">
              <div id="visitTrendChart" style={{ height: 400 }}></div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="访问来源分布">
              <div id="visitSourceChart" style={{ height: 400 }}></div>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Card title="访问深度分析">
              <div id="visitDepthChart" style={{ height: 400 }}></div>
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  );
}
