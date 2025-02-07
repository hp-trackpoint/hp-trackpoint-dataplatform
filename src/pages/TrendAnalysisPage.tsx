import type { RadioChangeEvent, DatePickerProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Radio, Layout, DatePicker, Card, Space, Table, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TableProps } from 'antd';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import useTrendStore from '../stores/trendStore';
import {
  timeToday,
  timeSeven,
  timeThirty,
  timeYesterday,
  visitorAll,
  visitorNew,
  visitorOld,
} from '../stores/trendStore';
import * as echarts from 'echarts';

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
const { RangePicker } = DatePicker;
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
export default function TrendAnalysisPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartData: ChartData[] = [
    { time: '00时', pageviews: 1020, visits: 20 },
    { time: '01时', pageviews: 350, visits: 10 },
    { time: '02时', pageviews: 50, visits: 5 },
    { time: '03时', pageviews: 300, visits: 15 },
    { time: '04时', pageviews: 180, visits: 8 },
    { time: '05时', pageviews: 150, visits: 6 },
    { time: '06时', pageviews: 200, visits: 10 },
    { time: '07时', pageviews: 350, visits: 15 },
    { time: '08时', pageviews: 1000, visits: 25 },
    { time: '09时', pageviews: 1700, visits: 30 },
    { time: '10时', pageviews: 1520, visits: 35 },
    { time: '11时', pageviews: 1550, visits: 40 },
    { time: '12时', pageviews: 1800, visits: 45 },
    { time: '13时', pageviews: 1920, visits: 50 },
    { time: '14时', pageviews: 2580, visits: 55 },
    { time: '15时', pageviews: 1900, visits: 60 },
    { time: '16时', pageviews: 2300, visits: 65 },
    { time: '17时', pageviews: 1780, visits: 70 },
    { time: '18时', pageviews: 1850, visits: 75 },
    { time: '19时', pageviews: 1720, visits: 80 },
    { time: '20时', pageviews: 1650, visits: 85 },
    { time: '21时', pageviews: 1580, visits: 90 },
    { time: '22时', pageviews: 700, visits: 95 },
    { time: '23时', pageviews: 0, visits: 100 },
  ];
  useEffect(() => {
    if (chartRef.current) {
      // 初始化 ECharts 实例
      const myChart = echarts.init(chartRef.current);
      console.log('chartRef.current:', chartRef.current);
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
      console.log('ECharts option:', option);
      // 设置 ECharts 选项
      myChart.setOption(option);

      // 组件卸载时销毁 ECharts 实例
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  const disabled6MonthsDate: DatePickerProps['disabledDate'] = (
    current,
    { from, type }
  ) => {
    if (from) {
      const minDate = from.add(-5, 'months');
      const maxDate = from.add(5, 'months');

      switch (type) {
        case 'year':
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );

        default:
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );
      }
    }

    return false;
  };
  interface ApiResponse {
    // 根据实际的 API 响应结构定义
    message: string;
    // 可以添加更多字段
  }

  //时间选择和用户选择的状态管理

  const time = useTrendStore((state) => state.timeState);
  const visitor = useTrendStore((state) => state.visitorState);
  const onChangeTime = (e: RadioChangeEvent) => {
    if (e.target.value === 'today') {
      timeToday();
    }
    if (e.target.value === 'yesterday') {
      timeYesterday();
    }
    if (e.target.value === 'seven') {
      timeSeven();
    }
    if (e.target.value === 'thirty') {
      timeThirty();
    }
  };
  const onChangeVisitor = (e: RadioChangeEvent) => {
    if (e.target.value === 'all') {
      visitorAll();
    }
    if (e.target.value === 'new') {
      visitorNew();
    }
    if (e.target.value === 'old') {
      visitorOld();
    }
  };
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
        const response = await axios.get(
          `https://your-api-url.com/data?time=${time}&visitor=${visitor}`
        );
        setData(response.data);
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
  }, [time, visitor]);
  if (loading) {
    return <p>Loading... </p>;
  }

  /*  if (error) {
    return <p>Error: {error}</p>;
  } */
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '按时', value: 'Hour' },
    { label: '按日', value: 'Day' },
    { label: '按周', value: 'Week' },
    { label: '按月', value: 'Month' },
  ];
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
        <div
          style={{
            marginRight: 20,
            marginLeft: 5,
          }}
        >
          <span>时间：</span>
          <Radio.Group
            onChange={onChangeTime}
            value={time}
            options={[
              {
                value: 'today',
                label: <p>今日</p>,
              },
              {
                value: 'yesterday',
                label: <p>昨日</p>,
              },
              {
                value: 'seven',
                label: <p>近7天</p>,
              },
              {
                value: 'thirty',
                label: <p>近30天</p>,
              },
            ]}
          />
        </div>
        <RangePicker
          disabledDate={disabled6MonthsDate}
          picker="month"
          style={{ marginRight: 40 }}
        />
        <Radio.Group
          block
          options={options}
          defaultValue="Apple"
          optionType="button"
          buttonStyle="solid"
        />
        <div style={{ width: '100%' }} />
        <div
          style={{
            marginRight: 20,
            marginLeft: 5,
          }}
        >
          <span>访客：</span>
          <Radio.Group
            onChange={onChangeVisitor}
            value={visitor}
            options={[
              {
                value: 'all',
                label: <p>全部</p>,
              },
              {
                value: 'new',
                label: <p>新访客</p>,
              },
              {
                value: 'old',
                label: <p>老访客</p>,
              },
            ]}
          />
        </div>
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
                dataSource={TableData}
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
