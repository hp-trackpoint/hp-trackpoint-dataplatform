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

const DEBOUNCE_DELAY = 300; // 防抖延迟时间（毫秒）

const HomePage: React.FC = () => {
  const [data, setData] = useState<CardItem[]>([]);
  const [statsData, setStatsData] = useState<TrackStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

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
      } catch (err) {
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div>
      <RangePicker onChange={onChange} needConfirm />
      <div style={{ padding: 24 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {/* Page Info Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Page Information" bordered={false} hoverable>
                <p>Total PV: {statsData?.pageInfo.totalPV}</p>
                <p>Total UV: {statsData?.pageInfo.totalUV}</p>
                <p>CID: {statsData?.pageInfo.cid}</p>
              </Card>
            </Col>

            {/* Environment Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Environment Statistics" bordered={false} hoverable>
                {statsData?.environmentStats.map((env, index) => (
                  <div key={index}>
                    <p>Environment: {env.environment}</p>
                    <p>PV: {env.pv}</p>
                    <p>First Visit: {dayjs(env.firstVisit).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>Last Visit: {dayjs(env.lastVisit).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Device Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Device Statistics" bordered={false} hoverable>
                {statsData?.deviceStats.map((device, index) => (
                  <div key={index}>
                    <p>OS: {device.deviceInfo.os} {device.deviceInfo.osVersion}</p>
                    <p>Browser: {device.deviceInfo.browser} {device.deviceInfo.browserVersion}</p>
                    <p>Device Type: {device.deviceInfo.deviceType}</p>
                    <p>Region: {device.deviceInfo.region}</p>
                    <p>Count: {device.count}</p>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Module Stats Card */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Module Statistics" bordered={false} hoverable>
                <p>Total Clicks: {statsData?.moduleStats.totalClicks}</p>
                {statsData?.moduleStats.modules.map((module, index) => (
                  <div key={index}>
                    <p>Module ID: {module.moduleId}</p>
                    <p>Click Count: {module._count.id}</p>
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card title="Module Statistics" bordered={false} hoverable>
               
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage;
