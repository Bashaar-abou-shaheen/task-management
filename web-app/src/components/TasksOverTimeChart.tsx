import { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import axios from "axios";
import ReactECharts from "echarts-for-react";

type TaskStats = {
  date: string;
  created: number;
  completed: number;
};

const TasksOverTimeChart = () => {
  const [data, setData] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/chart/daily-task-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to load task stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartOptions = () => {
    return {
      title: {
        text: "Tasks Over Time",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        top: 30,
        data: ["Created", "Completed"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.date),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Created",
          type: "line",
          data: data.map((item) => item.created),
          smooth: true,
          lineStyle: { color: "#3b82f6" },
        },
        {
          name: "Completed",
          type: "line",
          data: data.map((item) => item.completed),
          smooth: true,
          lineStyle: { color: "#10b981" },
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

export default TasksOverTimeChart;
