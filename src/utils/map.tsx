import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

const EchartsMapComponent = () => {
  const chartRef = useRef(null);
  const [mapData, setMapData] = useState(null);
  const apiUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setMapData(response.data);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      }
    };

    fetchMapData();
  }, [apiUrl]);

  useEffect(() => {
    if (mapData) {
      const regionData = [
        { name: '陕西省', value: 3950 },
        { name: '福建省', value: 2000 },
        { name: '广东省', value: 6200 },
        { name: '湖南省', value: 7390 },
        { name: '河北省', value: 8690 },
      ];

      // 注册地图数据
      echarts.registerMap('customMap', mapData);

      // 获取 DOM 元素
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);

      // 配置 ECharts 选项
      const option = {
        tooltip: {
          trigger: 'item',
        },
        visualMap: {
          min: Math.min(...regionData.map((item) => item.value)),
          max: Math.max(...regionData.map((item) => item.value)),
          text: ['高', '低'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgba(179, 209, 240, 0.12)', 'rgba(87, 92, 241, 0.9)'],
          },
        },
        series: [
          {
            name: '中国地图',
            type: 'map',
            map: 'customMap',
            label: {
              show: false, // 默认不显示地区名称
              emphasis: {
                show: true, // 鼠标悬停时显示地区名称
              },
            },
            data: regionData,
          },
        ],
      };

      // 使用配置项显示图表
      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }

      // 监听窗口大小变化，自适应调整图表大小
      window.addEventListener('resize', () => {
        myChart.resize();
      });

      return () => {
        // 组件卸载时销毁图表
        myChart.dispose();
        window.removeEventListener('resize', () => {
          myChart.resize();
        });
      };
    }
  }, [mapData]);

  return (
    <div ref={chartRef} style={{ width: '1000px', height: '900px' }}></div>
  );
};

export default EchartsMapComponent;
