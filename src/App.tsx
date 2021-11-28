import './App.css';
import React, { useState } from 'react';

import MapPage from './pages/MapPage';
import { Button, Col, Divider, Layout, Menu, Modal, Row, Statistic, Typography } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { displayOverlay } from './config';
import { GroupedBarChart } from './pages/MapPage/components/Charts';
import distanceNoSensor from './pages/MapPage/data/distances-no_sensor.json';
import distanceSensor from './pages/MapPage/data/distances-has_sensor.json';

import stepsHasSensor from './pages/MapPage/data/steps_before_parked-has_sensor.json';
import stepsNoSensor from './pages/MapPage/data/steps_before_parked-no_sensor.json';

const { Content, Sider } = Layout;

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  if (!displayOverlay) {
    return <MapPage />;
  }

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Content>
          <MapPage />
        </Content>
      </Layout>
      <Sider collapsed={true}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={[]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => setIsModalVisible(true)}>
            Evaluation
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <Menu.Item key="sub1" icon={<UserOutlined />}>
            User
          </Menu.Item>
          <Menu.Item key="sub2" icon={<TeamOutlined />}>
            Team
          </Menu.Item>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Modal
        title="Evaluation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key={'close'} onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={1200}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Typography.Title level={3}>Time of searching for parking</Typography.Title>
            <Divider />
          </Col>
          <Col span={12}>
            <Typography.Title level={3}>Parking distance from destination</Typography.Title>
            <Divider />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={3}>
            <Statistic title="Mean  🚕" value={9.917713} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Mean 🚙" value={31.966592} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Std 🚕" value={15.466198} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Std  🚙" value={43.08173} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Mean  🚕" value={23.053408} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Mean 🚙" value={32.330095} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Std 🚕" value={40.683004} precision={2} />
          </Col>
          <Col span={3}>
            <Statistic title="Std 🚙 " value={50.401432} precision={2} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <GroupedBarChart allData={[...stepsNoSensor, ...stepsHasSensor]} />
          </Col>
          <Col span={12}>
            <GroupedBarChart allData={[...distanceNoSensor, ...distanceSensor]} />
          </Col>
        </Row>
      </Modal>
    </Layout>
  );
}

export default App;
