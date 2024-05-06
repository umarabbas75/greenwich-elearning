import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CourseProgressGraph = () => {
  const data = [
    { number: 1, percentage: 83, course: 'nebosh' },
    { number: 2, percentage: 34, course: 'iosh' },
    // { number: 3, percentage: 0, course: 'iosh' },
  ];
  const xAxisTicks = ['nebosh', 'iosh'];
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      console.log('payload', payload[0]);

      return (
        <div className="bg-white text-center py-3 flex flex-col justify-center items-center rounded-xl w-72">
          {/* <p className="text-green font-bold fs-x-large">{`${formattedCurrency(payload?.[0].payload?.avg_price?.toFixed(2))}`}</p> */}
          <p className="rounded-full bg-secondaryLight text-green px-6 py-3 text-center mt-2 w-fit uppercase">
            {payload?.[0]?.payload?.course}
          </p>
          <p className="text-primary text-center mt-2 w-fit underline">
            Course is {payload?.[0]?.payload?.percentage}% completed{' '}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="w-full h-72 ">
      <h2 className="text-2xl font-semibold  text-primary pt-6 px-6">Course progress</h2>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart height={100} data={data} barSize={10} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
          <XAxis ticks={xAxisTicks} dataKey="course" type="category" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {[<Bar key={1} dataKey="percentage" name="percentage" stackId="a" />]}
          {/* <text x={180} y={10} dominantBaseline="middle" textAnchor="middle">
            nebosh
          </text>
          <text x={180} y={50} dominantBaseline="middle" textAnchor="middle">
            iosh
          </text> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseProgressGraph;
