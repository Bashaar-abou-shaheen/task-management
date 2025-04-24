import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Sider } = Layout;

const SiderBar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const role = localStorage.getItem("role"); // 'admin' or 'user'

  const menuItems = [
    {
      key: "Board",
      icon: <DashboardOutlined style={{ color: "#BFA77A" }} />,
      label: <span style={{ color: "#333" }}>Board</span>,
      hidden: role !== "user",
    },
    {
      key: "admin-dashboard",
      icon: <DashboardOutlined style={{ color: "#BFA77A" }} />,
      label: <span style={{ color: "#333" }}>Dashboard</span>,
      hidden: role !== "admin",
    },
    {
      key: "task",
      icon: <PlusCircleOutlined style={{ color: "#BFA77A" }} />,
      label: <span style={{ color: "#333" }}>Task</span>,
      hidden: role !== "admin",
    },
    {
      key: "ManageUsers",
      icon: <UserOutlined style={{ color: "#BFA77A" }} />,
      label: <span style={{ color: "#333" }}>Manage Users</span>,
      hidden: role !== "admin", // Only show for admin
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#BFA77A" }} />,
      label: <span style={{ color: "#333" }}>Logout</span>,
    },
  ].filter((item) => !item.hidden);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={220}
      style={{
        backgroundColor: "#fff",
        borderRight: "1px solid #eee",
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        height: "100vh",
        position: "sticky",
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
      trigger={null}
    >
      <div
        style={{
          height: 64,
          margin: "1rem",
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center",
          color: "#BFA77A",
          transition: "opacity 0.2s",
          opacity: collapsed ? 0 : 1,
        }}
      >
        TaskBoard
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["Board"]}
        style={{
          border: "none",
          fontSize: 16,
          fontWeight: 500,
          backgroundColor: "#fff",
        }}
        onClick={({ key }) => {
          if (key === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId"); // optionally clear userId too
            navigate("/");
          }
           else {
            navigate(`/${key}`);
          }
        }}
        items={menuItems}
      />

      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          cursor: "pointer",
        }}
        onClick={toggleCollapsed}
      >
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 18, color: "#BFA77A" }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 18, color: "#BFA77A" }} />
        )}
      </div>
    </Sider>
  );
};

export default SiderBar;
