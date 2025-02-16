import { Layout, Card, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import createHeaderState from '../stores/headerStore';
import * as echarts from 'echarts';
import {
  TimeSelector,
  VisitorSelector,
  SourceSelector,
  DeviceSelector,
} from '../layouts/SelectHeader';

const { Content } = Layout;
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
interface ChartData {
  time: string;
  pageviews: number;
  visits: number;
}
const useHeaderState = createHeaderState();

export default function TrendAnalysisPage() {
  const chartRef = useRef<HTMLDivElement>(null);
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

  interface ApiResponse {
    // 根据实际的 API 响应结构定义
    message: string;
    // 可以添加更多字段
  }

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

  //请求数据
  const [data, setData] = useState<ApiResponse | null>(null);
  // 定义加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 定义错误状态
  const [error, setError] = useState<string | null>(null);

  // 使用 useEffect 监听 time 和 visitor 的变化
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 假设这里是请求的 API 地址，根据 time 和 visitor 拼接参数
        /* const response = await axios.get(
         `https://your-api-url.com/data?time=${time}&visitor=${visitor}`
        );
        setData(response.data); */
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <p>Loading... </p>;
  }

  /*  if (error) {
    return <p>Error: {error}</p>;
  } */

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '日期',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: '浏览量',
      dataIndex: 'Pageviews',
      key: 'Pageviews',
      render: (text, record) => {
        if (record.data === '今日预测') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '访问次数',
      dataIndex: 'Visits',
      key: 'Visits',
      render: (text, record) => {
        if (record.data === '今日预测') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '访客数',
      dataIndex: 'UniqueVisitors',
      key: 'UniqueVisitors',
      render: (text, record) => {
        if (record.data === '今日预测') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: 'IP数',
      dataIndex: 'IPNumbers',
      key: 'IPNumbers',
      render: (text, record) => {
        if (record.data === '今日预测') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '平均访问页数',
      dataIndex: 'AveragePageviewsPerVisit',
      key: 'AveragePageviewsPerVisit',
      render: (text, record) => {
        if (record.data === '今日预测') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '平均访问时长',
      dataIndex: 'AverageVisitDuration',
      key: 'AverageVisitDuration',
      render: (text, record) => {
        if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        }
        return text;
      },
    },
    {
      title: '跳出率',
      dataIndex: 'BounceRate',
      key: 'BounceRate',
      render: (text, record) => {
        if (record.data === '环比 (今日与昨日)') {
          return (
            <>
              {text}
              <Tag color="green">↑</Tag>
            </>
          );
        } else if (record.data === '同比 (今日与上周同期)') {
          return (
            <>
              {text}
              <Tag color="red">↓</Tag>
            </>
          );
        }
        return text;
      },
    },
  ];
  const TableData: DataType[] = [
    {
      data: '今日',
      Pageviews: 25409,
      Visits: 1590,
      UniqueVisitors: 1284,
      IPNumbers: 1121,
      AveragePageviewsPerVisit: 16,
      AverageVisitDuration: '00:06:55',
      BounceRate: '5.03%',
    },
    {
      data: '昨日',
      Pageviews: 27278,
      Visits: 1816,
      UniqueVisitors: 1491,
      IPNumbers: 1254,
      AveragePageviewsPerVisit: 16,
      AverageVisitDuration: '00:05:41',
      BounceRate: '4.90%',
    },
    {
      data: '今日预测',
      Pageviews: 29718,
      Visits: 1805,
      UniqueVisitors: 1452,
      IPNumbers: 1272,
      AveragePageviewsPerVisit: 17,
      AverageVisitDuration: '--',
      BounceRate: '--',
    },
    {
      data: '环比 (今日与昨日)',
      Pageviews: -6.85,
      Visits: -12.44,
      UniqueVisitors: -13.88,
      IPNumbers: -10.61,
      AveragePageviewsPerVisit: 6.39,
      AverageVisitDuration: '21.62',
      BounceRate: '2.65%',
    },
    {
      data: '同比 (今日与上周同期)',
      Pageviews: 408.69,
      Visits: 284.99,
      UniqueVisitors: 278.76,
      IPNumbers: 236.64,
      AveragePageviewsPerVisit: 32.13,
      AverageVisitDuration: '54.90',
      BounceRate: '-54.85%',
    },
  ];

  return (
    <div>
      {/* 固定 Header */}
      <div
        style={{
          position: 'fixed',
          top: 65, // 关键定位参数
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

      {/* 内容区域 */}
      <Content style={{ marginTop: 78, padding: '0 0px' }}>
        <div style={{ background: '#fff', padding: 0, minHeight: '100vh' }}>
          {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <></>}
          <Space direction="vertical" size={16}>
            <Card title="" style={{ width: '80vw', height: 500 }}>
              <h2>流量概览</h2>
              <Table
                columns={columns}
                dataSource={TableData.map((item) => ({
                  ...item,
                  key: item.data,
                }))}
                pagination={false}
              />
            </Card>
          </Space>
          <Space direction="vertical" size={16}>
            <Card style={{ width: '80vw', height: 500 }}>
              <h2>趋势图</h2>
              <div ref={chartRef} style={{ width: '900', height: '400px' }} />
            </Card>
          </Space>
        </div>
      </Content>
    </div>
  );
}
