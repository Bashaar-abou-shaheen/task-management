// src/components/EditTaskModal.tsx
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
} from "antd";
import { Task } from "../types";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess?: () => void;
  onStatusUpdate?: () => void;
  loading?: boolean;
};

const { TextArea } = Input;

const EditTaskModal = ({
  open,
  onClose,
  task,
  onSuccess,
  onStatusUpdate,
  loading,
}: Props) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        dueDate: dayjs(task.dueDate),
        priority: task.priority,
        status: task.status,
        recurring: task.recurring,
        assignedTo: task.assignedTo,
      });
    }
  }, [task, form]);

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      await axios.put(
        `http://localhost:3001/admin-task/${task?.id}`,
        {
          ...values,
          dueDate: values.dueDate.format("YYYY-MM-DD"), // format date for backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Task updated successfully");
      onClose();
      onSuccess?.();
      onStatusUpdate?.();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Task"
      centered
      onCancel={onClose}
      footer={null}
      width={720}
      bodyStyle={{
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "1.25rem",
      }}
    >
      {!task || loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: "Low",
            status: "To Do",
            recurring: "none",
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Due date is required" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Priority" name="priority">
            <Select>
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="To Do">To Do</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Done">Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Recurring" name="recurring">
            <Select>
              <Select.Option value="none">None</Select.Option>
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
              <Select.Option value="monthly">Monthly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Assigned To (Username)"
            name="assignedTo"
            rules={[{ required: true, message: "Assigned user is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="text-center mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              className="bg-[#1677ff] px-8"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditTaskModal;
