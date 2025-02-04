import type { RadioChangeEvent, DatePickerProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Radio, Layout, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import axios from 'axios';
import { useState, useEffect } from 'react';
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
const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
const { RangePicker } = DatePicker;
const { Content } = Layout;
export default function TrendAnalysisPage() {
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '按时', value: 'Hour' },
    { label: '按日', value: 'Day' },
    { label: '按周', value: 'Week' },
    { label: '按月', value: 'Month' },
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
          <p>Content</p>
          <h2>Data:</h2>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </Content>
    </div>
  );
}
