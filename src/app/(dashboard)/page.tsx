'use client';

import { useSession } from 'next-auth/react';

import ContinueWhereYouLeft from './_components/dashboard/ContinueWhereYouLeft';
import CourseProgressGraph from './_components/dashboard/CourseProgressGraph';
import TodoList from './_components/dashboard/TodoList';
import WorldClock from './_components/dashboard/WorldClock';

export default function Home() {
  const { data: userData } = useSession();

  return (
    <div className="flex flex-col gap-6">
      {userData?.user?.role === 'user' && (
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4  text-primary">Active course(s)</h2>
          <ContinueWhereYouLeft />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* World Clock */}
        <div
          className={`bg-white rounded-lg shadow-md ${
            userData?.user?.role === 'user' ? 'lg:col-span-3' : 'lg:col-span-5'
          }  `}
        >
          <WorldClock />
        </div>
        {userData?.user?.role === 'user' && (
          <div className="bg-white rounded-lg shadow-md  lg:col-span-2">
            <CourseProgressGraph />
          </div>
        )}
      </div>
      <div>
        <TodoList />
      </div>
    </div>
  );
}
