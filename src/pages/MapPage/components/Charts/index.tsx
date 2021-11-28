import React  from 'react';
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

    label: {
      position: 'top',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  // @ts-ignore
  return <Column {...config} />;
};
