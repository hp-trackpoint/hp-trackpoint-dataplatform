import React, { useState, useEffect, useRef } from 'react';
import type { DatePickerProps } from 'antd';
import { DatePicker, Row, Col, Card, Skeleton } from 'antd';
import dayjs from 'dayjs';

interface CardItem {
  id: number;
  title: string;
  content?: string;
  createdAt?: string;
  description?: string;
}

const DEBOUNCE_DELAY = 300; // 防抖延迟时间（毫秒）

const HomePage: React.FC = () => {
  const [data, setData] = useState<CardItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const debounceTimer = useRef<number | null>(null);

  // 防抖处理日期变化
  const onChange: DatePickerProps['onChange'] = (date) => {
    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 设置新的定时器
    debounceTimer.current = window.setTimeout(() => {
      if (date) {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
      } else {
        setSelectedDate(null);
      }
    }, DEBOUNCE_DELAY);
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

        // 模拟请求（替换为实际接口调用）
        const mockData = [
          {
            id: 1,
            title: 'Example 1',
            createdAt: '2025-01-31',
            description: 'Data for 2023-01-31',
          },
          {
            id: 2,
            title: 'Example 2',
            createdAt: '2025-02-01',
            description: 'Data for 2025-02-01',
          },
          {
            id: 3,
            title: 'Example 3',
            createdAt: '2025-02-02',
            description: 'Data for 2023-02-02',
          },
        ];

        // 根据日期过滤
        const filteredData = selectedDate
          ? mockData.filter((item) => item.createdAt === selectedDate)
          : mockData;

        setData(filteredData);
      } catch (err) {
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div>
      <DatePicker onChange={onChange} needConfirm />
      <div style={{ padding: 24 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={12} lg={12} xl={12}>
                <Card
                  title={item.title}
                  bordered={false}
                  hoverable
                  style={{ height: 200 }}
                >
                  <p>{item.description || 'No description available'}</p>
                  <p>创建时间：{item.createdAt || 'Unknown'}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage;
