import { TimeSelector } from '../../layouts/SelectHeader';
import createHeaderState from '../../stores/headerStore';
import { Popover, Divider, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './visited.css';
import React from 'react';
const useHeaderState = createHeaderState();

export default function VisitedPage() {
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

  const { timeState, onChangeTime } = useHeaderState();
  const content1 = (
    <div className="content">
      <p>
        即通常说的Page
        View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。
      </p>
    </div>
  );
  const content2 = (
    <div className="content">
      <p>
        一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。
      </p>
    </div>
  );
  const content3 = <p>该页面给站内其他页面直接带去的浏览量。</p>;
  const content4 = (
    <div className="content">
      <p>作为访问会话最后一个浏览页面（即退出页面）的次数。</p>
    </div>
  );
  const content5 = (
    <div className="content">
      <p>
        访客浏览某一页面时所花费的平均时长，页面的停留时长=进入下一个页面的时间-进入本页面的时间。
      </p>
    </div>
  );

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
            <span className="span">浏览量(PV)</span>
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
            <span className="span">贡献下游浏览量</span>
            <Popover content={content3} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">退出页次数</span>
            <Popover content={content4} placement="bottomLeft">
              <QuestionCircleOutlined />
            </Popover>
            <p className="number">65489</p>
          </div>
          <div>
            <span className="span">平均停留时长</span>
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

        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
}
