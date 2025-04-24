import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  message,
  Tag,
  Tooltip,
} from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TaskDetailModal from "../../components/TaskDetailModal";
import { Task } from "../../types"; // Adjust path to your Task type if needed
import EditTaskModal from "../../components/EditTaskModal";
import showMessage from "../../components/Message";

const { Title } = Typography;

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/admin-task", {
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
      const res = await axios.get(`http://localhost:3001/admin-task/${taskId}`, {
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

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3001/admin-task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    //   message.success("Task deleted successfully");
    fetchTasks();
    showMessage("success", "Task deleted successfully!");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br ">
      <Title level={3} className="text-center text-indigo-700 mb-8 drop-shadow-md">
        All Tasks
      </Title>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {tasks
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            )
            .map((task) => (
              <Col xs={24} md={12} lg={8} key={task.id}>
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
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-3 flex gap-3">
                      <Tooltip title="Edit">
                        <EditOutlined
                          className="text-indigo-500 hover:text-indigo-700 text-lg cursor-pointer"
                          onClick={() => openTaskModal(task.id)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteOutlined
                          className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                          onClick={() => handleDeleteTask(task.id)}
                        />
                      </Tooltip>
                    </div>

                    <Title level={5} className="mb-2 text-indigo-600">
                      {task.title}
                    </Title>
                    <p className="text-xs text-gray-500 mb-1">
                      Due: <span className="font-medium">{task.dueDate}</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Assigned to: <span className="font-medium">{task.assignedTo}</span>
                    </p>
                    <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                  </Card>
                </motion.div>
              </Col>
            ))}
        </Row>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        open={modalVisible}
        loading={modalLoading}
        onClose={closeModal}
        task={selectedTask}
        onStatusUpdate={fetchTasks}
      />
    </div>
  );
}
