import { useSession } from 'next-auth/react';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useApiGet } from '@/lib/dashboard/client/user';

import GraphSkeletonLoader from './GraphSkeletonLoader';

const CourseProgressGraph = () => {
  const { data: userData } = useSession();

  const { data, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses', userData?.user.id],
    config: {
      select: (res) => {
        // return res?.data;
        const updatedResult = res?.data?.data?.map((item: any) => {
          return {
            number: item?.id,
            percentage: item?.percentage,
            course: item?.title,
          };
        });
        return updatedResult;
      },
      keepPreviousData: true,
    },
  });
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-center py-3 flex flex-col justify-center items-center rounded-xl w-72">
          <p className="rounded-full bg-secondaryLight text-green px-6 py-3 text-center mt-2 w-fit uppercase">
            {payload?.[0]?.payload?.course}
          </p>
          <p className="text-primary text-center mt-2 w-fit underline">
            Course is {payload?.[0]?.payload?.percentage?.toFixed(2)}% completed{' '}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 ">
      <h2 className="text-2xl font-semibold  text-primary pt-6 px-6">Course progress</h2>

      {isLoading ? (
        <GraphSkeletonLoader />
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <BarChart
            height={100}
            data={data}
            barSize={10}
            margin={{ top: 25, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="course" type="category" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {[<Bar key={1} dataKey="percentage" name="percentage" stackId="a" className="dark:fill-white" />]}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CourseProgressGraph;
