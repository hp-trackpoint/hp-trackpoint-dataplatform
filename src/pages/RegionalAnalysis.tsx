import { useState } from 'react';
import {
  TimeSelector,
  VisitorSelector,
  DeviceSelector,
  SourceSelector,
} from '../layouts/SelectHeader';
import createHeaderState from '../stores/headerStore';
import EchartsMapComponent from '../utils/map';
import { Row, Col, Card, Table, Select } from 'antd';

// 定义城市数据的类型
interface CityData {
  city: string;
  pv: number;
  uv: number;
  ip: number;
  bounceRate: string;
  avgDuration: string;
}

// 定义省份数据的类型
interface ProvinceData {
  key: string;
  province: string;
  pv: number;
  uv: number;
  ip: number;
  bounceRate: string;
  avgDuration: string;
  cityData: CityData[];
}
const useHeaderState = createHeaderState();
const dataSourceTable = [
  {
    key: '1',
    province: '广东',
    visits: 107592,
    visitors: 80000,
    ip: 75000,
  },
  {
    key: '2',
    province: '江苏',
    visits: 71325,
    visitors: 50000,
    ip: 45000,
  },
  {
    key: '3',
    province: '山东',
    visits: 70793,
    visitors: 52000,
    ip: 48000,
  },
  {
    key: '4',
    province: '河南',
    visits: 68000,
    visitors: 49000,
    ip: 46000,
  },
  {
    key: '5',
    province: '浙江',
    visits: 62000,
    visitors: 45000,
    ip: 42000,
  },
  {
    key: '6',
    province: '河北',
    visits: 55000,
    visitors: 40000,
    ip: 38000,
  },
  {
    key: '7',
    province: '湖南',
    visits: 52000,
    visitors: 38000,
    ip: 36000,
  },
  {
    key: '8',
    province: '湖北',
    visits: 50000,
    visitors: 36000,
    ip: 34000,
  },
  {
    key: '9',
    province: '安徽',
    visits: 48000,
    visitors: 34000,
    ip: 32000,
  },
  {
    key: '10',
    province: '福建',
    visits: 45000,
    visitors: 32000,
    ip: 30000,
  },
  {
    key: '11',
    province: '四川',
    visits: 42000,
    visitors: 30000,
    ip: 28000,
  },
  {
    key: '12',
    province: '北京',
    visits: 40000,
    visitors: 28000,
    ip: 26000,
  },
  {
    key: '13',
    province: '上海',
    visits: 38000,
    visitors: 26000,
    ip: 24000,
  },
  {
    key: '14',
    province: '重庆',
    visits: 35000,
    visitors: 24000,
    ip: 22000,
  },
  {
    key: '15',
    province: '天津',
    visits: 32000,
    visitors: 22000,
    ip: 20000,
  },
  {
    key: '16',
    province: '陕西',
    visits: 30000,
    visitors: 20000,
    ip: 18000,
  },
  {
    key: '17',
    province: '山西',
    visits: 28000,
    visitors: 18000,
    ip: 16000,
  },
  {
    key: '18',
    province: '江西',
    visits: 25000,
    visitors: 16000,
    ip: 14000,
  },
  {
    key: '19',
    province: '广西',
    visits: 22000,
    visitors: 14000,
    ip: 12000,
  },
  {
    key: '20',
    province: '云南',
    visits: 20000,
    visitors: 12000,
    ip: 10000,
  },
];
const dataSourceVisits = dataSourceTable.map((item) => ({
  key: item.key,
  province: item.province,
  value: item.visits,
}));

const dataSourceVisitors = dataSourceTable.map((item) => ({
  key: item.key,
  province: item.province,
  value: item.visitors,
}));

const dataSourceIp = dataSourceTable.map((item) => ({
  key: item.key,
  province: item.province,
  value: item.ip,
}));
// 模拟数据，每个省有下属市数据
const dataSource: ProvinceData[] = [
  {
    key: '1',
    province: '广东',
    pv: 177390,
    uv: 86198,
    ip: 82904,
    bounceRate: '75.35%',
    avgDuration: '00:02:59',
    cityData: [
      {
        city: '广州',
        pv: 15063,
        uv: 16892,
        ip: 31205,
        bounceRate: '79.39%',
        avgDuration: '00:01:39',
      },
      {
        city: '深圳',
        pv: 40000,
        uv: 23159,
        ip: 36533,
        bounceRate: '83.76%',
        avgDuration: '00:02:27',
      },
      // 更多市数据
    ],
  },
  {
    key: '2',
    province: '江苏',
    pv: 109514,
    uv: 56392,
    ip: 54854,
    bounceRate: '78.66%',
    avgDuration: '00:02:41',
    cityData: [
      {
        city: '南京',
        pv: 51863,
        uv: 25963,
        ip: 72163,
        bounceRate: '63.88%',
        avgDuration: '00:02:29',
      },
      {
        city: '苏州',
        pv: 19560,
        uv: 95259,
        ip: 76523,
        bounceRate: '83.76%',
        avgDuration: '00:02:27',
      },
      // 更多市数据
    ],
  },
  // 更多省份数据
];

const columns = [
  {
    title: '地域',
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: '浏览量(PV)',
    dataIndex: 'pv',
    key: 'pv',
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

const expandable = {
  expandedRowRender: (record: ProvinceData) => {
    return (
      <Table
        columns={[
          {
            title: '市',
            dataIndex: 'city',
            key: 'city',
          },
          {
            title: '浏览量(PV)',
            dataIndex: 'pv',
            key: 'pv',
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
            title: '跳出率',
            dataIndex: 'bounceRate',
            key: 'bounceRate',
          },
          {
            title: '平均访问时长',
            dataIndex: 'avgDuration',
            key: 'avgDuration',
          },
        ]}
        dataSource={record.cityData}
      />
    );
  },
  expandIconColumnIndex: 0,
};

export default function EventAnalysisPage() {
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

  const getColumns = (state: string) => {
    return [
      {
        title: '省份',
        dataIndex: 'province',
        key: 'province',
      },
      {
        title:
          state === '浏览量(PV)'
            ? '浏览量(PV)'
            : state === '访客数(UV)'
              ? '访客数'
              : 'IP 数',
        dataIndex: 'value',
        key: 'value',
      },
    ];
  };

  const columnsTable = getColumns(showState);

  const getDataSource = (state: string) => {
    if (state === '浏览量(PV)') {
      return dataSourceVisits;
    } else if (state === '访客数(UV)') {
      return dataSourceVisitors;
    } else {
      return dataSourceIp;
    }
  };

  const currentDataSource = getDataSource(showState);
  return (
    <>
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
      <div
        style={{ backgroundColor: 'white', padding: '20px', paddingTop: 100 }}
      >
        {' '}
        {/* 增加 paddingTop */}
        <Row gutter={16}>
          {/* 顶部数据卡片 */}
          <Col span={4}>
            <Card title="浏览量(PV)">1,375,694</Card>
          </Col>
          <Col span={4}>
            <Card title="访客数(UV)">699,561</Card>
          </Col>
          <Col span={4}>
            <Card title="IP数">683,810</Card>
          </Col>
          <Col span={4}>
            <Card title="跳出率">77.93%</Card>
          </Col>
          <Col span={4}>
            <Card title="平均访问时长">00:02:42</Card>
          </Col>
        </Row>
        <div style={{ display: 'flex' }}>
          <Select
            value={showState}
            style={{ width: 200 }}
            onChange={onChangeState}
            placeholder="请选择来源"
            options={selectOptions}
          />
          <EchartsMapComponent />
          <Table columns={columnsTable} dataSource={currentDataSource} />
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          expandable={expandable}
        />
      </div>
    </>
  );
}
