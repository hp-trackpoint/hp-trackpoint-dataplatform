import { TimeSelector } from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';
import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Table } from 'antd';
import * as echarts from 'echarts';

// 性能数据
interface PerformanceData {
  timestamp: string;
  lcp: number;
  fcp: number;
  cls: number;
  page_url: string;
  device: string;
  browser: string;
}

const useHeaderState = createHeaderState();

export default function PerformanceAnalysisPage() {
  const { timeState, onChangeTime } = useHeaderState();

  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [deviceFilter, setDeviceFilter] = useState<string | undefined>();
  const [browserFilter, setBrowserFilter] = useState<string | undefined>();

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const fetchPerformanceData = () => {
    setLoading(true);

    const mockData: PerformanceData[] = [
      {
        timestamp: '2025-02-01',
        lcp: 250,
        fcp: 200,
        cls: 0.1,
        page_url: '/home',
        device: 'mobile',
        browser: 'Chrome',
      },
      {
        timestamp: '2025-02-02',
        lcp: 300,
        fcp: 250,
        cls: 0.2,
        page_url: '/about',
        device: 'desktop',
        browser: 'Firefox',
      },
      {
        timestamp: '2025-02-03',
        lcp: 280,
        fcp: 240,
        cls: 0.15,
        page_url: '/contact',
        device: 'tablet',
        browser: 'Safari',
      },
    ];
    setData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [deviceFilter, browserFilter]);

  // 初始化 ECharts 实例
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 销毁 ECharts 实例
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  // 更新
  useEffect(() => {
    if (chartInstance.current && data.length > 0) {
      const timestamps = data.map((d) => d.timestamp);
      const lcpData = data.map((d) => d.lcp);
      const fcpData = data.map((d) => d.fcp);

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['LCP', 'FCP'],
        },
        xAxis: {
          type: 'category',
          data: timestamps,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => `${value} ms`,
          },
        },
        series: [
          {
            name: 'LCP',
            type: 'line',
            data: lcpData,
          },
          {
            name: 'FCP',
            type: 'line',
            data: fcpData,
          },
        ],
      };

      chartInstance.current.setOption(option);
    }
  }, [data]);

  // 表格列定义
  const columns = [
    {
      title: '页面 URL',
      dataIndex: 'page_url',
      key: 'page_url',
    },
    {
      title: 'LCP (ms)',
      dataIndex: 'lcp',
      key: 'lcp',
      sorter: (a: PerformanceData, b: PerformanceData) => a.lcp - b.lcp,
    },
    {
      title: 'FCP (ms)',
      dataIndex: 'fcp',
      key: 'fcp',
      sorter: (a: PerformanceData, b: PerformanceData) => a.fcp - b.fcp,
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
    },
  ];

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 65,
          width: '100%',
          height: 96,
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
      </div>
      <Row
        gutter={[16, 16]}
        style={{
          height: 'auto',
          gap: '10px',
          marginTop: 93,
        }}
      >
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="LCP (ms)" loading={loading}>
                {data.length > 0
                  ? Math.round(
                      data.reduce((sum, d) => sum + d.lcp, 0) / data.length
                    )
                  : 'N/A'}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="FCP (ms)" loading={loading}>
                {data.length > 0
                  ? Math.round(
                      data.reduce((sum, d) => sum + d.fcp, 0) / data.length
                    )
                  : 'N/A'}
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 趋势图 */}
        <Col span={24}>
          <Card title="性能趋势" loading={loading}>
            <div ref={chartRef} style={{ height: 400 }} />
          </Card>
        </Col>

        {/* 表格展示 */}
        <Col span={24}>
          <Card title="性能问题 Top 页面" loading={loading}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="page_url"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
