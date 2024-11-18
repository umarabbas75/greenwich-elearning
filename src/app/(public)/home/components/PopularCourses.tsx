import Link from 'next/link';
import React from 'react';

import PublicHeading from '@/components/common/PublicHeading';
import { useApiGet } from '@/lib/dashboard/client/user';

const PopularCourses = () => {
  const { data: coursesData } = useApiGet<any, Error>({
    endpoint: `/courses/public`,
    queryKey: ['get-courses-public'],
    config: {
      select: (res: any) => res?.data?.data,
      keepPreviousData: true,
    },
  });

  return (
    <div className=" bg-gray-100 py-24">
      <div className="app-container">
        <PublicHeading
          containerClasses="text-center"
          backGroundHeading="Excellent"
          mainHeading="Popular Courses"
          bgHeadingClasses="text-center"
        />

        <div className="grid grid-cols-3 gap-6 w-full">
          {coursesData?.map((item: any) => {
            return (
              <Link
                href={{
                  pathname: `/publicCourses/${item.id}`,
                }}
                key={item?.id}
              >
                <div className="col-span-1  pl-5 pr-5 mb-5 lg:pl-2 lg:pr-2 cursor-pointer">
                  <div className="shadow-xl bg-white rounded-lg m-h-64 p-2 transform hover:translate-y-2 hover:shadow-xl transition duration-300">
                    <figure className="mb-2">
                      <img src={item?.image} alt="nebosh course" className="h-64 ml-auto mr-auto p-8" />
                    </figure>
                    <div className="rounded-lg p-4 bg-publicRed flex flex-col">
                      <div>
                        <h5 className="text-white text-xl font-bold leading-none line-clamp-3 h-[60px]">
                          {item?.title}
                        </h5>
                        <p className="text-xs text-[#c6e0eb] leading-1.5 mt-2 line-clamp-4 h-[64px] mb-2">
                          {item?.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-lg text-white font-light">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                            item?.price || 0,
                          )}
                        </div>
                        <button className="rounded-full bg-purple-900 text-white hover:bg-white hover:text-purple-900 hover:shadow-xl focus:outline-none w-10 h-10 flex ml-auto transition duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="stroke-current m-auto"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
