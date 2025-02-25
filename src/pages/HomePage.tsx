import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Row, Col, Card, Layout, Table } from 'antd';
import dayjs from 'dayjs';
import EchartsMapComponent from '../utils/data';
import * as echarts from 'echarts';
import {
  TimeSelector,
  VisitorSelector,
  SourceSelector,
  DeviceSelector,
} from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';
import type { ColumnsType } from 'antd/es/table';

interface CardItem {
  id: number;
  title: string;
  content?: string;
  createdAt?: string;
  description?: string;
}

interface ChartData {
  time: string;
  pageviews: number;
  visits: number;
}

interface TrackStatsResponse {
  pageInfo: {
    cid: string;
    totalPV: number;
    totalUV: number;
  };
  environmentStats: Array<{
    environment: string;
    pv: number;
    firstVisit: string;
    lastVisit: string;
  }>;
  deviceStats: Array<{
    deviceInfo: {
      os: string;
      region: string;
      browser: string;
      osVersion: string;
      deviceType: string;
      browserVersion: string;
    };
    count: number;
  }>;
  moduleStats: {
    totalClicks: number;
    modules: Array<{
      _count: {
        id: number;
      };
      moduleId: number;
    }>;
  };
}

interface RegionData {
  name: string;
  value: number;
}

interface DataType {
  data: string;
  Pageviews: number;
  Visits: number;
  UniqueVisitors: number;
  IPNumbers: number;
  AveragePageviewsPerVisit: number;
  AverageVisitDuration: string;
  BounceRate: string;
}

const useHeaderState = createHeaderState();
const DEBOUNCE_DELAY = 300; // 防抖延迟时间（毫秒）

const { Content } = Layout;

const HomePage: React.FC = () => {
  const [data, setData] = useState<CardItem[]>([]);
  const [statsData, setStatsData] = useState<TrackStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );

  //时间选择和用户选择的状态管理
  const {
    timeState,
    visitorState,
    deviceState,
    sourceState,
    onChangeTime,
    onChangeVisitor,
    onChangeDevice,
    onChangeSource,
  } = useHeaderState();

  const chartData: ChartData[] = [
    { time: '00时', pageviews: 1020, visits: 200 },
    { time: '01时', pageviews: 350, visits: 100 },
    { time: '02时', pageviews: 50, visits: 30 },
    { time: '03时', pageviews: 300, visits: 100 },
    { time: '04时', pageviews: 180, visits: 80 },
    { time: '05时', pageviews: 150, visits: 60 },
    { time: '06时', pageviews: 200, visits: 100 },
    { time: '07时', pageviews: 350, visits: 150 },
    { time: '08时', pageviews: 1000, visits: 250 },
    { time: '09时', pageviews: 1700, visits: 300 },
    { time: '10时', pageviews: 1520, visits: 350 },
    { time: '11时', pageviews: 1550, visits: 400 },
    { time: '12时', pageviews: 1800, visits: 450 },
    { time: '13时', pageviews: 1920, visits: 500 },
    { time: '14时', pageviews: 2580, visits: 550 },
    { time: '15时', pageviews: 1900, visits: 1000 },
    { time: '16时', pageviews: 2300, visits: 650 },
    { time: '17时', pageviews: 1780, visits: 700 },
    { time: '18时', pageviews: 1850, visits: 750 },
    { time: '19时', pageviews: 1720, visits: 800 },
    { time: '20时', pageviews: 1650, visits: 850 },
    { time: '21时', pageviews: 1580, visits: 900 },
    { time: '22时', pageviews: 700, visits: 700 },
    { time: '23时', pageviews: 0, visits: 100 },
  ];

  useEffect(() => {
    if (chartRef.current) {
      // 初始化 ECharts 实例
      const myChart = echarts.init(chartRef.current);

      // 配置 ECharts 选项
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['浏览量', '访问次数'],
        },
        xAxis: {
          type: 'category',
          data: chartData.map((item) => item.time),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '浏览量',
            type: 'line',
            data: chartData.map((item) => item.pageviews),
            symbol: 'circle',
            itemStyle: {
              color: '#1890ff',
            },
            lineStyle: {
              color: '#1890ff',
            },
          },
          {
            name: '访问次数',
            type: 'line',
            data: chartData.map((item) => item.visits),
            symbol: 'circle',
            itemStyle: {
              color: '#fadb14',
            },
            lineStyle: {
              color: '#fadb14',
            },
          },
        ],
      };

      // 设置 ECharts 选项
      myChart.setOption(option);

      // 组件卸载时销毁 ECharts 实例
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  const debounceTimer = useRef<number | null>(null);

  // Replace DatePicker with RangePicker
  const { RangePicker } = DatePicker;

  const onChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      const startTime = dayjs(start).format('YYYY-MM-DDTHH:mm:ss[Z]');
      const endTime = dayjs(end).format('YYYY-MM-DDTHH:mm:ss[Z]');
      setDateRange([startTime, endTime]);
    } else {
      setDateRange(null);
    }
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // 获取时间范围
  const getTimeRange = (timeValue: string) => {
    const now = dayjs();
    let startTime, endTime;

    switch (timeValue) {
      case 'today':
        startTime = now.startOf('day');
        endTime = now.endOf('day');
        break;
      case 'yesterday':
        startTime = now.subtract(1, 'day').startOf('day');
        endTime = now.subtract(1, 'day').endOf('day');
        break;
      case 'seven':
        startTime = now.subtract(6, 'day').startOf('day');
        endTime = now.endOf('day');
        break;
      case 'thirty':
        startTime = now.subtract(29, 'day').startOf('day');
        endTime = now.endOf('day');
        break;
      default:
        startTime = now.startOf('day');
        endTime = now.endOf('day');
    }

    return {
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  // 获取数据的 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const timeRange = getTimeRange(timeState);

        // 构建 URL 和参数
        const params = new URLSearchParams({
          cid: 'home_page',
          startTime: timeRange.startTime,
          endTime: timeRange.endTime,
          visitor: visitorState,
          device: deviceState,
          source: sourceState,
        });

        const url = `http://62.234.16.19/track-stats/page?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
          setStatsData(data.data);

          // 处理地区数据
          const regionStats = data.data.deviceStats.reduce(
            (acc: Record<string, number>, curr: any) => {
              const region = curr.deviceInfo.region;
              acc[region] = (acc[region] || 0) + curr.count;
              return acc;
            },
            {}
          );

          const formattedRegionData = Object.entries(regionStats).map(
            ([name, value]) => ({
              name,
              value,
            })
          );
          setRegionData(formattedRegionData);
        } else {
          console.error('API 返回错误:', data.message);
        }
      } catch (err) {
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeState, visitorState, deviceState, sourceState]); // 添加所有筛选条件作为依赖

  // 初始化图表
  useEffect(() => {
    // 确保DOM元素存在
    if (!chartRef.current) return;

    // 创建图表实例
    const chart = echarts.init(chartRef.current);
    setChartInstance(chart);

    // 清理函数
    return () => {
      chart.dispose();
    };
  }, []);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartInstance]);

  // 页面概览表格列定义
  const pageInfoColumns: ColumnsType<any> = [
    {
      title: '指标',
      dataIndex: 'metric',
      key: 'metric',
      width: '50%',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
  ];

  // 页面概览数据
  const pageInfoData = [
    {
      key: '1',
      metric: '浏览量(PV)',
      value: statsData?.pageInfo.totalPV || 0,
    },
    {
      key: '2',
      metric: '访客数(UV)',
      value: statsData?.pageInfo.totalUV || 0,
    },
  ];

  // 环境统计表格列定义
  const envColumns: ColumnsType<any> = [
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      width: '25%',
    },
    {
      title: 'PV',
      dataIndex: 'pv',
      key: 'pv',
      width: '25%',
    },
    {
      title: '首次访问',
      dataIndex: 'firstVisit',
      key: 'firstVisit',
      width: '25%',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后访问',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      width: '25%',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 设备统计表格列定义
  const deviceColumns: ColumnsType<any> = [
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      width: '20%',
      render: (text, record) =>
        `${record.deviceInfo.os} ${record.deviceInfo.osVersion}`,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      width: '20%',
      render: (text, record) =>
        `${record.deviceInfo.browser} ${record.deviceInfo.browserVersion}`,
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: '20%',
      render: (text, record) => record.deviceInfo.deviceType,
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: '20%',
      render: (text, record) => record.deviceInfo.region,
    },
    {
      title: '访问次数',
      dataIndex: 'count',
      key: 'count',
      width: '20%',
    },
  ];

  // 模块统计表格列定义
  const moduleColumns: ColumnsType<any> = [
    {
      title: '模块ID',
      dataIndex: 'moduleId',
      key: 'moduleId',
      width: '50%',
    },
    {
      title: '点击次数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      width: '50%',
      render: (text, record) => record._count.id,
    },
  ];

  return (
    <div>
      {/* Fixed Header */}
      <div
        style={{
          position: 'fixed',
          top: 65,
          width: '100%',
          height: 93,
          zIndex: 1,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 0px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TimeSelector
          time={timeState}
          onChangeTime={onChangeTime}
        ></TimeSelector>

        <VisitorSelector
          visitor={visitorState}
          onChangeVisitor={onChangeVisitor}
        ></VisitorSelector>
        <div style={{ width: '100%' }} />
        <DeviceSelector
          device={deviceState}
          onChangeDevice={onChangeDevice}
        ></DeviceSelector>
        <SourceSelector
          source={sourceState}
          onChangeSource={onChangeSource}
        ></SourceSelector>
      </div>

      {/* Content Area */}
      <Content
        style={{
          marginTop: 80, // 65 + 93 = 158
          padding: '0 24px',
          minHeight: '100vh',
          background: '#fff',
        }}
      >
        <div style={{}}>
          <Row gutter={[16, 16]}>
            {/* Page Info Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="页面概览"
                bordered={false}
                hoverable
                style={{ height: 300 }}
              >
                <Table
                  columns={pageInfoColumns}
                  dataSource={pageInfoData}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            {/* Environment Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="环境统计"
                bordered={false}
                hoverable
                style={{ height: 300 }}
              >
                <Table
                  columns={envColumns}
                  dataSource={statsData?.environmentStats || []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            {/* Device Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="设备统计"
                bordered={false}
                hoverable
                style={{ height: 300 }}
              >
                <Table
                  columns={deviceColumns}
                  dataSource={statsData?.deviceStats || []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            {/* Module Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="模块统计"
                bordered={false}
                hoverable
                style={{ height: 300 }}
              >
                <Table
                  columns={moduleColumns}
                  dataSource={statsData?.moduleStats.modules || []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            {/* Region Map Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Regional Distribution" bordered={false} hoverable>
                <EchartsMapComponent data={regionData} />
              </Card>
            </Col>

            {/* Trend Chart Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="趋势图" bordered={false} hoverable>
                <div
                  ref={chartRef}
                  style={{
                    width: '100%',
                    height: 300,
                    margin: '0 auto',
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </div>
  );
};

export default HomePage;
