import React from 'react';
import { Radio, DatePicker } from 'antd';
import { RadioChangeEvent, Select } from 'antd';

// 定义 onChange 函数的类型
type OnChangeFunction = (e: RadioChangeEvent) => void;
type OnChangeSourceFunction = (value: string | number | null) => void;
const { RangePicker } = DatePicker;

// 定义 TimeSelector 组件的 props 类型
type TimeSelectorProps = {
  onChangeTime: OnChangeFunction;
  time: string;
};
type VisitorSelectorProps = {
  onChangeVisitor: OnChangeFunction;
  visitor: string;
};
type DeviceSelectorProps = {
  onChangeDevice: OnChangeFunction;
  device: string;
};
type SourceSelectorProps = {
  onChangeSource: OnChangeSourceFunction;
  source: string;
};

//日期选择
export const TimeSelector: React.FC<TimeSelectorProps> = ({
  onChangeTime,
  time,
}) => {
  return (
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
      <RangePicker picker="month" style={{ marginRight: 40 }} />
    </div>
  );
};
//访客类型选择
export const VisitorSelector: React.FC<VisitorSelectorProps> = ({
  onChangeVisitor,
  visitor,
}) => {
  return (
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
  );
};

//设备来源选择
export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onChangeDevice,
  device,
}) => {
  return (
    <div
      style={{
        marginRight: 20,
        marginLeft: 5,
      }}
    >
      <span>访客：</span>
      <Radio.Group
        onChange={onChangeDevice}
        value={device}
        options={[
          {
            value: 'all',
            label: <p>全部</p>,
          },
          {
            value: 'computer',
            label: <p>电脑</p>,
          },
          {
            value: 'mobile',
            label: <p>移动设备</p>,
          },
        ]}
      />
    </div>
  );
};

export const SourceSelector: React.FC<SourceSelectorProps> = ({
  onChangeSource,
  source,
}) => {
  const selectOptions = [
    { value: 'all', label: '全部来源' },
    {
      label: '搜索引擎',
      options: [
        { value: 'google', label: '谷歌' },
        { value: 'baidu', label: '百度' },
        { value: 'yahoo', label: '雅虎' },
      ],
    },
    { value: 'external_link', label: '外部链接' },
    { value: 'direct_access', label: '直接访问' },
  ];
  return (
    <Select
      value={source}
      style={{ width: 200 }}
      onChange={onChangeSource}
      placeholder="请选择来源"
      options={selectOptions}
    />
  );
};
