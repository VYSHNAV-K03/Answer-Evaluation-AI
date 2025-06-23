import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Performance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get("http://localhost:7000/latest-performance"); // Update with your correct API URL
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="p-4">
      <a href="/dashboard" className="btn btn-primary mb-4">
        back
      </a>
      <h2 className="text-2xl font-bold mb-4">Student Performance</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalScore" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Performance;
