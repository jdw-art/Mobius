import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout } from 'antd';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Mobius</Link>
        </h1>
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
