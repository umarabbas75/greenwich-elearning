import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashedLineChart = () => {
  const data = [
    {
      name: '8 am',
      Running: 4000,
      warning: 2400,
      breakdown: 2400,
      inactive: 1400,
    },
    {
      name: '9 am',
      Running: 3000,
      warning: 1398,
      inactive: 1600,
    },
    {
      name: '10am',
      Running: 2000,
      warning: 9800,
      inactive: 2234,
    },
    {
      name: '11 am',
      Running: 2780,
      warning: 3908,
      inactive: 45,
    },
    {
      name: '12 pm',
      Running: 1890,
      warning: 4800,
      inactive: 1200,
    },
    {
      name: '1 pm',
      Running: 2390,
      warning: 3800,
      breakdown: 2500,
      inactive: 5600,
    },
    {
      name: '2 pm',
      Running: 3490,
      warning: 4300,
      breakdown: 2100,
      inactive: 3400,
    },
  ];
  return (
    <ResponsiveContainer aspect={2.5}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="warning" stroke="#8884d8" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="Running" stroke="#82ca9d" strokeDasharray="3 4 5 2" />
        <Line type="monotone" dataKey="breakdown" stroke="#453453" strokeDasharray="3 4 5 2" />
        <Line type="monotone" dataKey="inactive" stroke="#3a35a2" strokeDasharray="3 4 5 2" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashedLineChart;
