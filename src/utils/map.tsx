import { useEffect, useRef, useState } from 'react';
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
        { name: '北京市', value: 5678 },
        { name: '天津市', value: 12345 },
        { name: '河北省', value: 8901 },
        { name: '山西省', value: 17890 },
        { name: '内蒙古自治区', value: 3456 },
        { name: '辽宁省', value: 14567 },
        { name: '吉林省', value: 9876 },
        { name: '黑龙江省', value: 11234 },
        { name: '上海市', value: 16789 },
        { name: '江苏省', value: 13456 },
        { name: '浙江省', value: 7890 },
        { name: '安徽省', value: 4567 },
        { name: '福建省', value: 15678 },
        { name: '江西省', value: 2345 },
        { name: '山东省', value: 18901 },
        { name: '河南省', value: 6789 },
        { name: '湖北省', value: 10123 },
        { name: '湖南省', value: 19012 },
        { name: '广东省', value: 12456 },
        { name: '海南省', value: 3678 },
        { name: '重庆市', value: 13789 },
        { name: '四川省', value: 8912 },
        { name: '贵州省', value: 4789 },
        { name: '云南省', value: 16012 },
        { name: '西藏自治区', value: 2567 },
        { name: '陕西省', value: 11789 },
        { name: '甘肃省', value: 5012 },
        { name: '青海省', value: 14345 },
        { name: '宁夏回族自治区', value: 3012 },
        { name: '新疆维吾尔自治区', value: 17012 },
        { name: '香港特别行政区', value: 9123 },
        { name: '澳门特别行政区', value: 2123 },
        { name: '台湾省', value: 15012 },
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
            color: ['rgba(199, 199, 217, 0.92)', 'rgba(87, 92, 241, 0.9)'],
          },
        },
        series: [
          {
            name: '中国地图',
            type: 'map',
            map: 'customMap',
            label: {
              show: false, // 默认不显示地区名称
            },
            emphasis: {
              show: true, // 鼠标悬停时显示地区名称
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
    <div
      ref={chartRef}
      style={{ width: '1200px', height: '1100px', marginLeft: '0px' }}
    ></div>
  );
};

export default EchartsMapComponent;
