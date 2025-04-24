import { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, message, Card } from "antd";
import axios from "axios";
import showMessage from "../../components/Message";

const { Option } = Select;

const AddTask = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ userName: string; name: string }[]>([]);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/admin-task/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users); 
    } catch (error) {
      message.error("Failed to fetch users.");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3001/admin-task",
        {
          ...values,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage("success", "Task created successfully!");
      message.success("Task added successfully!");
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card title="Create New Task" className="w-full max-w-3xl shadow-md rounded-xl">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a task title" }]}
          >
            <Input placeholder="e.g., Prepare Safety Manual" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a task description" }]}
          >
            <Input.TextArea rows={4} placeholder="e.g., Complete draft of safety documentation" />
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please select a due date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select a priority level" }]}
          >
            <Select placeholder="Select priority">
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value="To Do">To Do</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Assigned To"
            name="assignedTo"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select placeholder="Select user">
              {users.map((user) => (
                <Option key={user.userName} value={user.userName}>
                  {user?.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Recurring"
            name="recurring"
            rules={[{ required: true, message: "Please select recurrence type" }]}
          >
            <Select placeholder="Select recurrence">
              <Option value="none">None</Option>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddTask;
