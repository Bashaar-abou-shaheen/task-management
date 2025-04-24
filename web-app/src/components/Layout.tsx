// src/components/Layout.tsx
import { Layout } from "antd";
import Navbar from "./Navbar";
import SiderBar from "./Sider";
import React from "react";

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderBar />
      <Layout>
        <Navbar />
        <Content style={{ margin: "24px 16px", padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
