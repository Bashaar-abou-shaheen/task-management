import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";

const { Title } = Typography;

type User = {
  _id: string;
  name: string;
  userName: string;
  email: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/admin-task/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.users);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br">
      <Title level={3} className="text-center text-indigo-700 mb-8 drop-shadow-md">
        All Users
      </Title>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {users.map((user) => (
            <Col xs={24} md={12} lg={8} key={user._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  size="default"
                  className="transition-all duration-300 border border-transparent hover:border-indigo-500 hover:shadow-md backdrop-blur-sm"
                  style={{
                    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
                    borderRadius: "1rem",
                    position: "relative",
                  }}
                >
                  <Title level={5} className="mb-2 text-indigo-600">
                    {user.name}
                  </Title>
                  <p className="text-sm text-gray-700 mb-1">
                    Username: <span className="font-medium">{user.userName}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Email: <span className="font-medium">{user.email}</span>
                  </p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
