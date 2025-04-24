// src/pages/Auth/Login.tsx
import { useState } from "react";
import { Input, Button, Form, message, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const url =
        role === "admin"
          ? "http://localhost:3001/auth/login/admin"
          : "http://localhost:3001/auth/login";

      const res = await axios.post(url, values);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", role);
      message.success("Login successful!");

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-board");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Log in to your account to manage your tasks</p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          {/* Role Selector */}
          <Form.Item
            name="role"
            initialValue="user"
            rules={[{ required: true, message: "Please select your role" }]}
          >
            <Select onChange={(value: "user" | "admin") => setRole(value)}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input
              placeholder="Email"
              className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Password"
              className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mt-6 mb-0">
            <Button
              htmlType="submit"
              loading={loading}
              className="bg-[#BFA77A] h-12 text-base font-semibold w-full"
              type="primary"
              shape="round"
            >
              Log In
            </Button>
          </Form.Item>

          {/* Link to Signup */}
          <div className="text-center text-sm mt-4 text-[#696969]">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#BFA77A] font-medium hover:underline">
              Sign up
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
