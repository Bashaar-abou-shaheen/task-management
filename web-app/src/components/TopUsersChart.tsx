import { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import axios from "axios";
import ReactECharts from "echarts-for-react";

type UserTaskCount = {
  user: string;
  tasks: number;
};

const TopUsersChart = () => {
  const [data, setData] = useState<UserTaskCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/chart/user-task-counts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to load top users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const getChartOptions = () => {
    const usernames = data.map((user) => user.user);
    const taskCounts = data.map((user) => user.tasks);

    return {
      title: {
        text: "Top Users by Task Count",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: usernames,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        name: "Tasks",
      },
      color: ["#10b981"], // teal
      series: [
        {
          name: "Tasks",
          type: "bar",
          data: taskCounts,
          barWidth: "30%",
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

export default TopUsersChart;
