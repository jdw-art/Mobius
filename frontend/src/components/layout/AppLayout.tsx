import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { Header, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Layout>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <h1 style={{ margin: 0 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
              Mobius
            </Link>
          </h1>
          <Space>
            <Text style={{ color: 'white' }}>
              <UserOutlined /> {user || 'User'}
            </Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: 'white' }}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
