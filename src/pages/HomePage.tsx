import React, { useState, useEffect, useRef } from 'react';
import type { DatePickerProps } from 'antd';
import {
  DatePicker,
  Row,
  Col,
  Card,
  Skeleton,
  Statistic,
  Progress,
  Table,
  Button,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import EchartsMapComponent from '../utils/data';
import * as echarts from 'echarts';
import { UserOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';

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

const DEBOUNCE_DELAY = 300; // 防抖延迟时间（毫秒）

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
  const envChartRef = useRef<HTMLDivElement>(null);
  const deviceChartRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [trendData, setTrendData] = useState<ChartData[]>([
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
  ]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = 'http://62.234.16.19/track-stats/page?cid=home_page';

        if (dateRange) {
          const [startTime, endTime] = dateRange;
          url += `&startTime=${startTime}&endTime=${endTime}`;
        }

        const response = await fetch(url);
        const data = await response.json();
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
      } catch (err) {
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // 初始化图表实例
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);
      setLoading(false);

      // 清理函数
      return () => {
        chart.dispose();
        setChartInstance(null);
      };
    }
  }, []);

  // 更新图表数据
  useEffect(() => {
    if (chartInstance && trendData) {
      const option = {
        grid: {
          top: 30,
          right: 30,
          bottom: 20,
          left: 50,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['浏览量', '访问次数'],
          top: 0,
          right: 10,
        },
        xAxis: {
          type: 'category',
          data: trendData.map((item) => item.time),
          axisLabel: {
            interval: 2,
            rotate: 45,
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        series: [
          {
            name: '浏览量',
            type: 'line',
            data: trendData.map((item) => item.pageviews),
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#1890ff',
            },
            lineStyle: {
              width: 2,
              color: '#1890ff',
            },
            smooth: true,
          },
          {
            name: '访问次数',
            type: 'line',
            data: trendData.map((item) => item.visits),
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#fadb14',
            },
            lineStyle: {
              width: 2,
              color: '#fadb14',
            },
            smooth: true,
          },
        ],
      };

      chartInstance.setOption(option, true);
    }
  }, [chartInstance, trendData, startDate, endDate]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartInstance]);

  // 环境统计饼图
  useEffect(() => {
    if (envChartRef.current && statsData?.environmentStats) {
      const chart = echarts.init(envChartRef.current);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#666',
          },
        },
        series: [
          {
            name: '环境分布',
            type: 'pie',
            radius: ['50%', '70%'],
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
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: statsData.environmentStats.map((env) => ({
              name: env.environment,
              value: env.pv,
            })),
          },
        ],
      };
      chart.setOption(option);
    }
  }, [statsData]);

  // 设备统计柱状图
  useEffect(() => {
    if (deviceChartRef.current && statsData?.deviceStats) {
      const chart = echarts.init(deviceChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: statsData.deviceStats.map(
            (device) => device.deviceInfo.deviceType
          ),
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: statsData.deviceStats.map((device) => ({
              value: device.count,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' },
                ]),
              },
            })),
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
          },
        ],
      };
      chart.setOption(option);
    }
  }, [statsData]);

  // 模块统计表格列定义
  const columns = [
    {
      title: '模块ID',
      dataIndex: 'moduleId',
      key: 'moduleId',
    },
    {
      title: '点击次数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      sorter: (a: any, b: any) => a.clickCount - b.clickCount,
    },
  ];

  // 日期选择处理函数
  const onStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
  };

  const onEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
  };

  // 添加 fetchData 函数
  const fetchData = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/trend-data', {
        params: {
          startDate: start.format('YYYY-MM-DD HH:mm:ss'),
          endDate: end.format('YYYY-MM-DD HH:mm:ss'),
        },
      });

      if (response.data) {
        setTrendData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // 可以添加错误处理，比如显示提示信息
    } finally {
      setLoading(false);
    }
  };

  // 确认按钮处理函数
  const handleDateConfirm = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  };

  return (
    <div>
      <RangePicker onChange={onChange} needConfirm />
      <div style={{ padding: 24 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {/* 页面概览 */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="页面概览"
                bordered={false}
                hoverable
                style={{ height: 400 }}
              >
                <Statistic
                  title="总浏览量"
                  value={statsData?.pageInfo.totalPV}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#1890ff', fontSize: 24 }}
                />
                <Progress
                  percent={90}
                  strokeWidth={12}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  style={{ margin: '20px 0' }}
                />
                <Statistic
                  title="独立访客"
                  value={statsData?.pageInfo.totalUV}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a', fontSize: 24 }}
                />
                <Progress
                  percent={75}
                  strokeWidth={12}
                  strokeColor={{
                    '0%': '#52c41a',
                    '100%': '#95de64',
                  }}
                  style={{ margin: '20px 0' }}
                />
              </Card>
            </Col>

            {/* 环境统计 */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="环境统计"
                bordered={false}
                hoverable
                style={{ height: 400 }}
              >
                <div ref={envChartRef} style={{ height: 250 }} />
              </Card>
            </Col>

            {/* 设备统计 */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="设备统计"
                bordered={false}
                hoverable
                style={{ height: 400 }}
              >
                <div ref={deviceChartRef} style={{ height: 250 }} />
              </Card>
            </Col>

            {/* 模块统计 */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                title="模块统计"
                bordered={false}
                hoverable
                style={{ height: 400 }}
              >
                <Table
                  columns={columns}
                  dataSource={statsData?.moduleStats.modules.map((module) => ({
                    key: module.moduleId,
                    moduleId: module.moduleId,
                    clickCount: module._count.id,
                  }))}
                  pagination={false}
                  scroll={{ y: 200 }}
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
              <Card
                title="趋势图"
                bordered={false}
                hoverable
                style={{ height: 300 }}
              >
                {loading ? (
                  <Skeleton active />
                ) : (
                  <div
                    ref={chartRef}
                    style={{
                      width: '100%',
                      height: '250px',
                      margin: '0 auto',
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage;
