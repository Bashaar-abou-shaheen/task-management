import { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import axios from "axios";
import ReactECharts from "echarts-for-react";

type PriorityStats = {
    [key: string]: number;
};

const TasksByPriorityChart = () => {
    const [data, setData] = useState<PriorityStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3001/chart/task-priority-stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(res.data);
        } catch (err: any) {
            message.error(err.response?.data?.message || "Failed to load task priority stats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getChartOptions = () => {
        const priorities = ["Low", "Medium", "High"];
        const values = priorities.map((p) => data?.[p] || 0);

        return {
            title: {
                text: "Tasks by Priority",
                left: "center",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
            },
            xAxis: {
                type: "category",
                data: priorities,
                axisTick: { alignWithLabel: true },
            },
            yAxis: {
                type: "value",
            },
            color: ["#3b82f6", "#f59e0b", "#ef4444"], // blue, orange, red
            series: [
                {
                    name: "Tasks",
                    type: "bar",
                    barWidth: "30%",
                    data: values,
                },
            ],
        };
    };

    return (
        <Card className="rounded-xl shadow-md">
            {loading ? (
                <div className="flex justify-center items-center h-60">
                    <Spin size="large" />
                </div>
            ) : (
                <ReactECharts option={getChartOptions()} style={{ height: 400 }} />
            )}
        </Card>
    );
};

export default TasksByPriorityChart;
