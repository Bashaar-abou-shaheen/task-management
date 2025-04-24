import { Row, Col, Card } from "antd";
import React from "react";
import SummaryCards from "../../components/SummaryCards";
import TasksByStatusChart from "../../components/TasksByStatusChart";
import TasksOverTimeChart from "../../components/TasksOverTimeChart";
import TasksByPriorityChart from "../../components/TasksByPriorityChart";
import TopUsersChart from "../../components/TopUsersChart";

// Import your chart components here
// import SummaryCards from "./charts/SummaryCards";
// import TasksByStatusChart from "./charts/TasksByStatusChart";
// import TasksOverTimeChart from "./charts/TasksOverTimeChart";
// import TasksByPriorityChart from "./charts/TasksByPriorityChart";
// import TopUsersChart from "./charts/TopUsersChart";

const AdminDashboard = () => {
    return (
        <div className="p-6 bg-gradient-to-br from-gray-100 to-indigo-50 min-h-screen">
            {/* Dashboard Grid */}
            <Row gutter={[24, 24]}>
                {/* 1. Summary Cards (KPI) */}
                <Col span={24}>
                    <div>
                        {/* Place your SummaryCards component here */}
                        <SummaryCards />
                    </div>
                </Col>

                {/* 2. Tasks by Status (Pie Chart) */}
                <Col xs={24} md={12} lg={8}>
                    <div>
                        <TasksByStatusChart />
                    </div>
                </Col>

                {/* 3. Tasks Over Time (Line/Bar Chart) */}
                <Col xs={24} md={12} lg={16}>
                    <div>
                        <TasksOverTimeChart />
                    </div>
                </Col>

                {/* 4. Tasks by Priority (Bar Chart) */}
                <Col xs={24} md={12}>
                    <div>
                        <TasksByPriorityChart />
                    </div>
                </Col>

                {/* 5. Top Users by Task Count */}
                <Col xs={24} md={12}>
                    <div>
                        <TopUsersChart />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
