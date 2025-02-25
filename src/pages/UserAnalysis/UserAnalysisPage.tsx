import {
  TimeSelector,
  VisitorSelector,
  DeviceSelector,
  SourceSelector,
} from '../../layouts/SelectHeader';
import createHeaderState from '../../stores/headerStore';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './user.css';
// 定义数据类型
type ChartData = {
  name: string;
  value: number;
};
const useHeaderState = createHeaderState();

export default function UserAnalysisPage() {
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

  // 模拟数据
  const pvData: ChartData[] = [
    { name: '新访客', value: 30 },
    { name: '老访客', value: 70 },
  ];
  const uvData: ChartData[] = [
    { name: '新访客', value: 20 },
    { name: '老访客', value: 80 },
  ];
  const bounceRateData: ChartData[] = [
    { name: '新访客', value: 10 },
    { name: '老访客', value: 90 },
  ];
  const avgDurationData: ChartData[] = [
    { name: '新访客', value: 15 },
    { name: '老访客', value: 85 },
  ];
  const avgPagesData: ChartData[] = [
    { name: '新访客', value: 25 },
    { name: '老访客', value: 75 },
  ];
  // 模拟新访客数量随时间变化的数据
  const newVisitorData: { time: string; count: number }[] = [
    { time: '周一', count: 120 },
    { time: '周二', count: 290 },
    { time: '周三', count: 180 },
    { time: '周四', count: 200 },
    { time: '周五', count: 70 },
    { time: '周六', count: 40 },
    { time: '周日', count: 350 },
  ];
  const getLineOption = (data: { time: string; count: number }[]) => ({
    title: {
      text: '新访客数量变化',
      left: 'center',
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
    xAxis: {
      type: 'category',
      data: data.map((item) => item.time),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新访客数量',
        type: 'line',
        data: data.map((item) => item.count),
        smooth: true,
        itemStyle: {
          color: '#f00',
        },
      },
    ],
  });
  // 折线图容器引用
  const newVisitorChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化新访客数量变化折线图
    if (newVisitorChartRef.current) {
      const newVisitorChart = echarts.init(newVisitorChartRef.current);
      newVisitorChart.setOption(getLineOption(newVisitorData));
      return () => {
        newVisitorChart.dispose();
      };
    }
  }, []);
  // 饼状图容器引用
  const pvChartRef = useRef<HTMLDivElement>(null);
  const uvChartRef = useRef<HTMLDivElement>(null);
  // 柱状图容器引用
  const bounceRateChartRef = useRef<HTMLDivElement>(null);
  const avgDurationChartRef = useRef<HTMLDivElement>(null);
  const avgPagesChartRef = useRef<HTMLDivElement>(null);

  // 饼状图配置
  const getPieOption = (data: ChartData[], title: string) => ({
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '访客类型占比',
        type: 'pie',
        radius: '50%',
        data: data.map((item) => ({ value: item.value, name: item.name })),
      },
    ],
  });

  // 柱状图配置
  const getBarOption = (data: ChartData[], title: string) => ({
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}<br/>{c}',
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: data.map((item) => item.value),
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  });

  useEffect(() => {
    // 初始化 PV 饼状图
    if (pvChartRef.current) {
      const pvChart = echarts.init(pvChartRef.current);
      pvChart.setOption(getPieOption(pvData, 'PV 访客类型占比'));
      return () => {
        pvChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // 初始化 UV 饼状图
    if (uvChartRef.current) {
      const uvChart = echarts.init(uvChartRef.current);
      uvChart.setOption(getPieOption(uvData, 'UV 访客类型占比'));
      return () => {
        uvChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // 初始化跳出率柱状图
    if (bounceRateChartRef.current) {
      const bounceRateChart = echarts.init(bounceRateChartRef.current);
      bounceRateChart.setOption(getBarOption(bounceRateData, '跳出率'));
      return () => {
        bounceRateChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // 初始化平均访问时长柱状图
    if (avgDurationChartRef.current) {
      const avgDurationChart = echarts.init(avgDurationChartRef.current);
      avgDurationChart.setOption(getBarOption(avgDurationData, '平均访问时长'));
      return () => {
        avgDurationChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // 初始化平均访问页面数柱状图
    if (avgPagesChartRef.current) {
      const avgPagesChart = echarts.init(avgPagesChartRef.current);
      avgPagesChart.setOption(getBarOption(avgPagesData, '平均访问页面数'));
      return () => {
        avgPagesChart.dispose();
      };
    }
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 65, // 关键定位参数
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
      <div className="card">
        <div>
          <h2 style={{ color: 'rgb(135, 206, 250)', textAlign: 'center' }}>
            新用户
          </h2>
          <div style={{ textAlign: 'center' }}>
            <img src="/src/img/person.png"></img>

            <p>浏览量： 583875</p>
            <p>访客数： 344568</p>
            <p>跳出率： 79.98%</p>
            <p>平均访问时长： 00:01:52</p>
            <p>平均访问页数： 1.43</p>
          </div>
        </div>
        <div>
          <h2 style={{ color: 'rgb(135, 206, 250)', textAlign: 'center' }}>
            老用户
          </h2>
          <div style={{ textAlign: 'center' }}>
            <img src="/src/img/personOld.jpg"></img>
            <p>浏览量： 583875</p>
            <p>访客数： 344568</p>
            <p>跳出率： 79.98%</p>
            <p>平均访问时长： 00:01:52</p>
            <p>平均访问页数： 1.43</p>
          </div>
        </div>
      </div>
      {/* 饼状图容器 */}
      <div className="pie">
        <div ref={pvChartRef} style={{ width: '500px', height: '500px' }}></div>
        <div ref={uvChartRef} style={{ width: '500px', height: '500px' }}></div>
      </div>
      {/* 柱状图容器 */}
      <div className="histogram">
        <div
          ref={bounceRateChartRef}
          style={{ width: '400px', height: '400px' }}
        ></div>
        <div
          ref={avgDurationChartRef}
          style={{ width: '400px', height: '400px' }}
        ></div>
        <div
          ref={avgPagesChartRef}
          style={{ width: '400px', height: '400px' }}
        ></div>
      </div>{' '}
      <div ref={newVisitorChartRef} className="line"></div>
    </div>
  );
}
