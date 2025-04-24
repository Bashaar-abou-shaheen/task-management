import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, message, Tag } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import TaskDetailModal from "../../components/TaskDetailModal";
import { Task } from "../../types"; // If you moved Task type to types/index.ts

const { Title } = Typography;

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/user-task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const openTaskModal = async (taskId: string) => {
    try {
      setModalVisible(true);
      setModalLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:3001/user-task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTask(res.data.task);
    } catch (err: any) {
      message.error("Failed to fetch task details");
      setModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const statusColumns = ["To Do", "In Progress", "Done"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "magenta";
      case "Medium":
        return "volcano";
      case "Low":
      default:
        return "green";
    }
  };

  const renderTasksByStatus = (status: string) => {
    const filtered = tasks.filter((task) => task.status === status);

    return filtered.map((task) => (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="mb-4 transition-all duration-300 border border-transparent hover:border-indigo-500 hover:shadow-md backdrop-blur-sm"
          size="small"
          style={{
            background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
            borderRadius: "1rem",
            cursor: "pointer",
          }}
          onClick={() => openTaskModal(task.id)}
        >
          <Title level={5} className="mb-2 text-indigo-600">
            {task.title}
          </Title>
          <p className="text-xs text-gray-500 mb-1">
            Due: <span className="font-medium">{task.dueDate}</span>
          </p>
          <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
        </Card>
      </motion.div>
    ));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100">
      <Title level={3} className="text-center text-indigo-700 mb-8 drop-shadow-md">
        Your Board
      </Title>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {statusColumns.map((status) => (
            <Col xs={24} md={8} key={status}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card
                  title={<span className="text-indigo-600 font-semibold">{status}</span>}
                  className="rounded-2xl shadow-lg border border-indigo-100"
                  bodyStyle={{
                    minHeight: "300px",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "1rem",
                  }}
                >
                  {renderTasksByStatus(status)}
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* Task Details Modal */}
      <TaskDetailModal
        open={modalVisible}
        onClose={closeModal}
        loading={modalLoading}
        task={selectedTask}
        onStatusUpdate={fetchTasks}
      />
    </div>
  );
}
