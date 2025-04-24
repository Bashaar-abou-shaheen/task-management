import { Layout } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        zIndex: 100,
        position: "sticky",  // ✅ Make sticky
        top: 0,               // ✅ Stick to top
        height: "64px",       // ✅ Fixed height to match default Header height
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#BFA77A",
          letterSpacing: "1px",
        }}
      >
        Task Management
      </div>
    </Header>
  );
};

export default Navbar;
