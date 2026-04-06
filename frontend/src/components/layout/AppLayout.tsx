import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { LayoutProps } from '@/types';

const { Header, Content } = Layout;

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout>
      <Header>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
            Mobius
          </Link>
        </h1>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
