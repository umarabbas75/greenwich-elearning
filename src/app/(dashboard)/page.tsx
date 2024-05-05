'use client';

import WorldClock from './_components/dashboard/WorldClock';

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* World Clock */}
      <div className="bg-white rounded-lg shadow-md  lg:col-span-2">
        <WorldClock />
      </div>

      {/* <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">To-Do List</h2>
        <TodoList />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Calendar</h2>
        <Calendar />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Continue Where You Left</h2>
        <ContinueWhereYouLeft />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Course Progress Graph</h2>
        <CourseProgressGraph />
      </div> */}
    </div>
  );
}
