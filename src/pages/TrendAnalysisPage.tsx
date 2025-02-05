import { useState } from 'react';
import type { RadioChangeEvent, DatePickerProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Radio, Layout, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
const { RangePicker } = DatePicker;
const { Header, Content } = Layout;
export default function TrendAnalysisPage() {
  const [value, setValue] = useState(1);
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
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '按时', value: 'Hour' },
    { label: '按日', value: 'Day' },
    { label: '按周', value: 'Week' },
    { label: '按月', value: 'Month' },
  ];
  return (
    <Layout>
      {/* 固定 Header */}
      <Header
        style={{
          position: 'fixed',
          top: 75, // 关键定位参数
          width: '100%',
          height: 46,
          zIndex: 1,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 15px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: 20 }}>
          <Radio.Group
            onChange={onChange}
            value={value}
            options={[
              {
                value: 1,
                label: <p>今日</p>,
              },
              {
                value: 2,
                label: <p>昨日</p>,
              },
              {
                value: 3,
                label: <p>近7天</p>,
              },
              {
                value: 4,
                label: <p>近30天</p>,
              },
            ]}
          />
        </div>
        <RangePicker disabledDate={disabled6MonthsDate} picker="month" />
        <Radio.Group
          block
          options={options}
          defaultValue="Apple"
          optionType="button"
          buttonStyle="solid"
        />
      </Header>

      {/* 内容区域 */}
      <Content style={{ marginTop: 78, padding: '0 10px' }}>
        <div style={{ background: '#fff', padding: 0, minHeight: '100vh' }}>
          <p>Content</p>
        </div>
      </Content>
    </Layout>
  );
}
