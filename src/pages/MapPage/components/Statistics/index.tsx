import React from 'react';
import {Card, Checkbox, Col, Divider, Progress, Row, Statistic, Typography} from 'antd';
import { displayOverlay } from '../../../../config';
import { TooltipItem } from '../TooltipItem';
const { Title, Text } = Typography;
import legendPicture from './Legend.png';
import carLegend from './CarLegend.png';
import carHorizontal from './CarLegendHorizontal.png';
import _ from 'lodash';

interface StatisticsOverlayProps {
  statistics: null | any;
}

export const StatisticsOverlay = ({ statistics }: StatisticsOverlayProps) => {
  if (!displayOverlay) return null;

  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 1000, bottom: 40, left: 40 }}>
        <Card
          bordered={false}
          style={{ width: 350, borderRadius: 10, boxShadow: 'rgb(19 19 19 / 54%) 0px 8px 24px' }}
        >
          <Title style={{ marginBottom: 0 }}>Budapest, HU</Title>
          <Text type="secondary">Parkingverse Simulation</Text>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Searching for parking with sensor"
                value={_.get(statistics, 'searching.has_sensor', '-')+ ' 🚕'}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Searching for parking without sensor"
                value={_.get(statistics, 'searching.no_sensor', '-')  + ' 🚙'}
              />
            </Col>
          </Row><br/><Row>
            <Col span={12}>
              <Statistic
                title="Empty spaces"
                value={_.get(statistics, 'number_of_spots.empty', '-')}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Occupied spaces"
                value={_.get(statistics, 'number_of_spots.not_empty', '-')}
              />
            </Col>
          </Row><br/>
          <Row>
            <Col span={24}>
              <Text type="secondary">Vehicles with sensor</Text>
              <Progress percent={35} />
            </Col>
          </Row>
        </Card>
      </div>
      <div style={{ position: 'absolute', zIndex: 1000, bottom: 40, right: 100 }}>
        <Card
          bordered={false}
          style={{ width: 250, borderRadius: 10, boxShadow: 'rgb(19 19 19 / 54%) 0px 8px 24px' }}
        >
          <img src={legendPicture} style={{ width: 190 }} />
        </Card>
      </div>
      {/*<div style={{ position: 'absolute', zIndex: 1000, bottom: 40, right: 380 }}>*/}
      {/*  <Card*/}
      {/*    bordered={false}*/}
      {/*    style={{ width: 300, borderRadius: 10, boxShadow: 'rgb(19 19 19 / 54%) 0px 8px 24px' }}*/}
      {/*  >*/}
      {/*    <img src={carLegend} style={{ width: 250 }} />*/}
      {/*  </Card>*/}
      {/*</div>*/}
      <div style={{ position: 'absolute', zIndex: 1000, bottom: 40, right: 370 }}>
        <Card
          bordered={false}
          style={{
            width: 900,
            borderRadius: 10,
            boxShadow: 'rgb(19 19 19 / 54%) 0px 8px 24px',
            padding: 0,
          }}
        >
          <img src={carHorizontal} style={{ width: 850 }} />
        </Card>
      </div>
    </div>
  );
};

export default StatisticsOverlay;
