import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header>
        <h1 style={{ color: 'white', margin: 0 }}>DevOps一体化平台</h1>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
