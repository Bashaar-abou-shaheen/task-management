import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, message } from "antd";
import axios from "axios";
import ReactECharts from "echarts-for-react";

type SummaryData = {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalUsers: number;
    activeToday: number;
};

const chartColors = {
    totalTasks: "#3b82f6",
    completedTasks: "#10b981",
    pendingTasks: "#f59e0b",
    totalUsers: "#6366f1",
    activeToday: "#ec4899",
};

const SummaryCards = () => {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3001/chart/summary", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(res.data);
        } catch (err: any) {
            message.error(err.response?.data?.message || "Failed to fetch summary.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const renderChart = (value: number, total: number, color: string) => {
        return {
            series: [
                {
                    type: "pie",
                    radius: ["60%", "80%"],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    labelLine: { show: false },
                    data: [
                        { value, name: "value", itemStyle: { color } },
                        { value: total - value, name: "rest", itemStyle: { color: "#f0f0f0" } },
                    ],
                },
            ],
        };
    };

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center p-10">
                <Spin size="large" />
            </div>
        );
    }

    const cards = [
        {
            title: "Total Tasks",
            value: data.totalTasks,
            color: chartColors.totalTasks,
        },
        {
            title: "Total Users",
            value: data.totalUsers,
            color: chartColors.totalUsers,
        },
        {
            title: "Completed Tasks",
            value: data.completedTasks,
            color: chartColors.completedTasks,
            total: data.totalTasks,
        },
        {
            title: "Pending Tasks",
            value: data.pendingTasks,
            color: chartColors.pendingTasks,
            total: data.totalTasks,
        },
        {
            title: "Active Today",
            value: data.activeToday,
            color: chartColors.activeToday,
            total: data.totalUsers,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {cards.map((card) => (
                <Col xs={24} sm={12} md={8} lg={4} key={card.title}>
                    <Card
                        hoverable
                        className="rounded-xl shadow-md h-full"
                        bodyStyle={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            height: 100,
                        }}
                    >
                        <div>
                            <Statistic title={card.title} value={card.value} />
                        </div>
                        {card.total ? (
                            <ReactECharts
                                option={renderChart(card.value, card.total, card.color)}
                                style={{ width: 80, height: 80 }}
                            />
                        ) : null}
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default SummaryCards;
