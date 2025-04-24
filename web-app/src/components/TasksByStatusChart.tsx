import { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import axios from "axios";
import ReactECharts from "echarts-for-react";

const TasksByStatusChart = () => {
  const [data, setData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/chart/taskstatuscounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch task status data.");
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
        text: "Tasks by Status",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Tasks",
          type: "pie",
          radius: "50%",
          data: Object.entries(data).map(([status, count]) => ({
            name: status,
            value: count,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };

  return (
    <Card  className="rounded-xl shadow-md">
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

export default TasksByStatusChart;
