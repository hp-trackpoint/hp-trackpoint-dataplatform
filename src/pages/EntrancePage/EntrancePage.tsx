import { TimeSelector } from '../../layouts/SelectHeader';
import createHeaderState from '../../stores/headerStore';
import { Popover, Divider, Select, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import './entrance.css';
import React from 'react';
const useHeaderState = createHeaderState();

export default function EntrancePage() {
  interface ColumnType {
    title: string;
    dataIndex: string;
    key: string;
    render?: (text: any, record: any, index: number) => React.ReactNode;
    sorter?: (a: any, b: any) => number;
  }

  // 定义表格数据类型
  interface TableDataType {
    key: number;
    url: string;
    uv: number;
    ip: number;
    pv: number;
    bounceRate: string;
    avgDuration: string;
  }

  const columns: ColumnType[] = [
    {
      title: '序号',
      dataIndex: '',
      key: 'index',
      render: (_, record, index) => index + 1, // 自定义渲染函数，显示序号
    },
    {
      title: '页面URL',
      dataIndex: 'url',
      key: 'url',
      render: (text) => <a href={text}>{text}</a>,
    },
    {
      title: '访客数(UV)',
      dataIndex: 'uv',
      key: 'uv',
    },
    {
      title: 'IP数',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '贡献浏览量',
      dataIndex: 'pv',
      key: 'pv',
      sorter: (a, b) => a.pv - b.pv,
    },
    {
      title: '跳出率',
      dataIndex: 'bounceRate',
      key: 'bounceRate',
    },
    {
      title: '平均访问时长',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
    },
  ];

  const dataSource: TableDataType[] = [
    {
      key: 1,
      url: 'https://demo.tongji.baidu.com/web/source/all',
      uv: 6815,
      ip: 6090,
      pv: 33574,
      bounceRate: '16.75%',
      avgDuration: '00:12:02',
    },
    {
      key: 2,
      url: 'https://demo.tongji.baidu.com/web/source/all',
      uv: 3989,
      ip: 4233,
      pv: 27242,
      bounceRate: '9.16%',
      avgDuration: '00:06:16',
    },
    // 可继续补充更多数据
  ];

  const [showState, setState] = useState('浏览量(PV)');
  const onChangeState = (e: string) => {
    if (e !== showState) {
      switch (e) {
        case '浏览量(PV)':
          setState('浏览量(PV)');
          break;
        case '访客数(UV)':
          setState('访客数(UV)');
          break;
        case 'IP数':
          setState('IP数');
          break;
        case '访问次数':
          setState('访问次数');
          break;
        case '新访客数':
          setState('新访客');
          break;
      }
    }
  };
  const selectOptions = [
    { value: '浏览量(PV)', label: '浏览量(PV)' },
    { value: '访客数(UV)', label: '访客数(UV)' },
    { value: 'IP数', label: 'IP数' },
  ];

  const { timeState, onChangeTime } = useHeaderState();
  const content1 = <p>指以该页面作为入口产生的浏览量（PV）总计。</p>;
  const content2 = (
    <div className="content">
      <p>
        一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。
      </p>
    </div>
  );
  const content3 = <p>一天之内您网站的独立访问ip数。</p>;
  const content4 = (
    <div className="content">
      <p>只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。</p>
    </div>
  );
  const content5 = (
    <div className="content">
      <p>
        访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。
      </p>
    </div>
  );
  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pieChartRef.current) {
      // 初始化圆环图
      const pieChart =
        echarts.getInstanceByDom(pieChartRef.current) ||
        echarts.init(pieChartRef.current);
      const pieOption: echarts.EChartsOption = {
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            data: [
              { value: 2.66, name: '数据1', itemStyle: { color: '#00BFFF' } },
              { value: 2.45, name: '数据2', itemStyle: { color: '#FF6347' } },
              { value: 2.23, name: '数据3', itemStyle: { color: '#32CD32' } },
              { value: 1.53, name: '数据4', itemStyle: { color: '#FFA500' } },
            ],
            label: {
              formatter: '{b}: {c}%',
            },
          },
        ],
      };
      pieChart.setOption(pieOption);

      return () => {
        // 组件卸载时销毁圆环图实例，避免内存泄漏
        pieChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (lineChartRef.current) {
      // 初始化折线图
      const lineChart =
        echarts.getInstanceByDom(lineChartRef.current) ||
        echarts.init(lineChartRef.current);
      const lineOption: echarts.EChartsOption = {
        xAxis: {
          type: 'category',
          data: [0, 3, 6, 9, 12, 15, 18, 21],
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        series: [
          {
            name: 'https://demo.ton...',
            type: 'line',
            data: [2000, 1500, 500, 400, 1000, 1300, 500, 0],
            itemStyle: {
              color: '#00BFFF',
            },
          },
          {
            name: 'https://demo.ton...',
            type: 'line',
            data: [500, 200, 100, 100, 1000, 1100, 1900, 0],
            itemStyle: {
              color: '#32CD32',
            },
          },
          {
            name: 'https://demo.ton...',
            type: 'line',
            data: [600, 300, 150, 120, 800, 1200, 2000, 0],
            itemStyle: {
              color: '#FF6347',
            },
          },
          {
            name: 'https://demo.ton...',
            type: 'line',
            data: [2000, 1000, 500, 550, 600, 100, 100, 0],
            itemStyle: {
              color: '#FFA500',
            },
          },
        ],
      };
      lineChart.setOption(lineOption);

      return () => {
        // 组件卸载时销毁折线图实例，避免内存泄漏
        lineChart.dispose();
      };
    }
  }, []);
  return (
    <div>
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
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)', // 定义 5 列，每列宽度相等
            height: 'auto',
            gap: '10px',
            marginTop: 93,
          }}
        >
          <div>
            <span className="span">贡献浏览量</span>
            <Popover content={content1} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">访客数(UV)</span>
            <Popover content={content2} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">IP数</span>
            <Popover content={content3} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">跳出率</span>
            <Popover content={content4} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">平均访问时间</span>
            <Popover
              content={content5}
              placement="bottomLeft"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
        </div>
        <Divider style={{ width: '90%', borderTopWidth: '2px' }} />

        <div style={{ display: 'flex' }}>
          <Select
            value={showState}
            style={{ width: 150 }}
            onChange={onChangeState}
            placeholder="请选择来源"
            options={selectOptions}
          />
          <div ref={pieChartRef} style={{ width: 400, height: 400 }}></div>
          <div ref={lineChartRef} style={{ width: 1100, height: 400 }}></div>
        </div>
        <Divider style={{ width: '90%', borderTopWidth: '2px' }} />
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
}
