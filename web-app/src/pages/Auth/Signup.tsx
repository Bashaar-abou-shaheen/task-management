// src/pages/Auth/Signup.tsx
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await axios.put("http://localhost:3001/auth/signup", values);
            message.success("Signup successful! Please login.");
            navigate("/user-board");
        } catch (error: any) {
            message.error(error.response?.data?.message || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Sign Up</h2>
                    <p className="text-sm text-[#BFA77A] font-medium">
                        <span className="text-gray-600">Or</span>{" "}
                        <a href="/" className="hover:underline">Login</a>
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Please enter your name!" }]}
                    >
                        <Input
                            placeholder="Name"
                            className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
                        />
                    </Form.Item>

                    <Form.Item
                        name="userName"
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input
                            placeholder="Username"
                            className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, type: "email", message: "Enter a valid email" },
                        ]}
                    >
                        <Input
                            placeholder="Email"
                            className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                min: 5,
                                message: "Password must be at least 5 characters!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Password"
                            className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("Passwords do not match!");
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Re-enter Password"
                            className="rounded-full h-10 px-4 border border-[#C4C4C4] outline-none"
                        />
                    </Form.Item>

                    <Form.Item className="mt-6 mb-0">
                        <Button
                            htmlType="submit"
                            loading={loading}
                            className="bg-[#BFA77A] h-12 text-base font-semibold w-full"
                            type="primary"
                            shape="round"
                        >
                            Create Account
                        </Button>
                    </Form.Item>

                    <div className="text-center text-sm mt-4 text-[#696969]">
                        Already have an account?{" "}
                        <a href="/" className="text-[#BFA77A] font-medium">
                            Sign in
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
}
