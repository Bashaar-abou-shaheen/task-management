import { Modal, Spin, Tag, Tooltip, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Task } from "../types";
import axios from "axios";
import { useState } from "react";

const MODAL_BODY_STYLE: React.CSSProperties = {
  maxHeight: "75vh",
  overflowY: "auto",
  padding: "2rem 2.5rem",
  backgroundColor: "#fff",
  borderRadius: "1.25rem",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
};

type Props = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  task: Task | null;
  onStatusUpdate?: () => void;
};

const TaskDetailModal = ({ open, onClose, loading, task, onStatusUpdate }: Props) => {
  const [updating, setUpdating] = useState(false);

  const valueStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    color: "#333",
    fontWeight: 500,
    marginBottom: "1.75rem",
    lineHeight: 1.5,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
      default:
        return "green";
    }
  };

  const getNextStatus = (current: string) => {
    if (current === "To Do") return "In Progress";
    if (current === "In Progress") return "Done";
    return null;
  };

  const handleStatusUpdate = async () => {
    if (!task) return;

    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3001/user-task/${task.id}/status`,
        { status: nextStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(`Task status updated to "${nextStatus}"`);
      // Optional: trigger re-fetch from parent or just close modal
      onClose();
      onStatusUpdate?.();
    } catch (err) {
      message.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      title={
        task && !loading ? (
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#BFA77A",
              letterSpacing: "0.5px",
              lineHeight: 1.3,
            }}
          >
            {task.title}
          </div>
        ) : null
      }
      bodyStyle={MODAL_BODY_STYLE}
    >
      {loading || !task ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "grid", rowGap: "2rem" }}>
          {/* Description full row */}
          <div style={valueStyle}>{task.description}</div>

          {/* 2-column grid for the rest */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "2.5rem",
              rowGap: "1.5rem",
            }}
          >
            <div style={valueStyle}>
              <Tag color="geekblue" style={{ fontSize: "1rem", padding: "4px 12px" }}>
                {task.status}
              </Tag>

              {task.status !== "Done" && (
                <Tooltip title={`Move to "${getNextStatus(task.status)}"`}>
                  <ArrowRightOutlined
                    onClick={handleStatusUpdate}
                    style={{
                      color: "#BFA77A",
                      fontSize: "1rem",
                      cursor: updating ? "not-allowed" : "pointer",
                      opacity: updating ? 0.5 : 1,
                      transition: "0.3s",
                    }}
                    spin={updating}
                  />
                </Tooltip>
              )}
            </div>

            <div style={valueStyle}>
              <Tag
                color={getPriorityColor(task.priority)}
                style={{ fontSize: "1rem", padding: "4px 12px" }}
              >
                {task.priority}
              </Tag>
            </div>

            <div style={valueStyle}>{task.dueDate}</div>
            <div style={valueStyle}>{task.recurring}</div>
            <div style={valueStyle}>{task.assignedTo}</div>
            <div style={valueStyle}>{task.createdAt}</div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
