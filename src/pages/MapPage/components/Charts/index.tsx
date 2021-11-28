import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/charts';
import _ from 'lodash';


export const GroupedBarChart = ({ allData }: any) => {
  const data = _.sortBy(allData, 'x');
  const config = {
    data: _.filter(data, (point) => point.x < 30 && point.x > 0),
    isGroup: true,
    xField: 'x',
    yField: 'y',
    seriesField: 'name',
    color: ['#ffd600', '#365dfd'],
    legend: {
      position: 'top' as any,
      itemName: {
        formatter: (s: string) => _.capitalize(s),
        style: {
          color: 'white',
          fill: 'white',
          fillOpacity: 1,
          opacity: 1,
          fontSize: 16,
        },
      },
    },

    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'top',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  // @ts-ignore
  return <Column {...config} />;
};
