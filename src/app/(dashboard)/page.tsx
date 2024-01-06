'use client';

// import DatePickerComp from '@/components/common/DatePicker';

import { useFetchDashboard } from '@/lib/dashboard/client/dashboard';
import { useFetchMapDriver } from '@/lib/dashboard/client/driver';

import Map from './gensetsonmap/_components/Map';

export default function Home() {
  const { data } = useFetchDashboard();
  const { data: mapData } = useFetchMapDriver({ status: 'Running' });
  const {
    inactive_gensets,
    iot_ready_gensets,
    registered_gensets,
    not_iot_ready_gensets,
    servicing_gensets,
    running_gensets,
    warning_gensets,
  } = data?.stats || {};

  const results = mapData?.results;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#d6ecb9] p-4 flex flex-col gap-5 rounded-md justify-between">
          <div className=" flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              version="1.1"
              className="h-8 w-8 "
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect
                  opacity="0.200000003"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                ></rect>
                <path
                  d="M4.5,7 L9.5,7 C10.3284271,7 11,7.67157288 11,8.5 C11,9.32842712 10.3284271,10 9.5,10 L4.5,10 C3.67157288,10 3,9.32842712 3,8.5 C3,7.67157288 3.67157288,7 4.5,7 Z M13.5,15 L18.5,15 C19.3284271,15 20,15.6715729 20,16.5 C20,17.3284271 19.3284271,18 18.5,18 L13.5,18 C12.6715729,18 12,17.3284271 12,16.5 C12,15.6715729 12.6715729,15 13.5,15 Z"
                  fill="#000000"
                  opacity="0.3"
                ></path>
                <path
                  d="M17,11 C15.3431458,11 14,9.65685425 14,8 C14,6.34314575 15.3431458,5 17,5 C18.6568542,5 20,6.34314575 20,8 C20,9.65685425 18.6568542,11 17,11 Z M6,19 C4.34314575,19 3,17.6568542 3,16 C3,14.3431458 4.34314575,13 6,13 C7.65685425,13 9,14.3431458 9,16 C9,17.6568542 7.65685425,19 6,19 Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
            <span className="font-bold text-xl text-gray-700">Gensets</span>
          </div>
          <div className="grid grid-cols-3 mb-2">
            <div className="border-r border-gray-400">
              <div className="flex flex-col md:flex-row  gap-1  md:gap-3 items-center">
                <img
                  src="/assets/images/generator.png"
                  alt=""
                  className="w-8 h-8 md:w-24 md:h-24"
                />
                <div className="flex md:block items-center gap-2">
                  <p className="font-bold text-2xl text-gray-700 mb-1">
                    {registered_gensets}
                  </p>
                  <p className="text-accent text-sm">Registered</p>
                </div>
              </div>
            </div>
            <div className="border-r border-gray-400  flex justify-center">
              <div className="flex  flex-col md:flex-row gap-1  md:gap-3 items-center">
                <img
                  src="/assets/images/iot_ready.png"
                  alt=""
                  className="w-8 h-8 md:w-24 md:h-24"
                />
                <div className="flex flex-row md:flex-col items-center gap-2">
                  <p className="font-bold text-2xl text-gray-700 mb-1">
                    {iot_ready_gensets}
                  </p>
                  <p className="text-accent text-sm">IOT Ready</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex  flex-col md:flex-row gap-1  md:gap-3 items-center">
                <img
                  src="/assets/images/not_iot_ready.png"
                  alt=""
                  className="w-8 h-8 md:w-24 md:h-24"
                />
                <div className="flex md:block items-center gap-2">
                  <p className="font-bold text-2xl text-gray-700 mb-1">
                    {not_iot_ready_gensets}
                  </p>
                  <p className="text-accent text-sm">No IOT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-5 rounded-md border">
          <div className=" flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24"></rect>
                <path
                  d="M16.4508979,17.4029496 L15.1784978,15.8599014 C16.324501,14.9149052 17,13.5137472 17,12 C17,10.4912085 16.3289582,9.09418404 15.1893841,8.14910121 L16.466112,6.60963188 C18.0590936,7.93073905 19,9.88958759 19,12 C19,14.1173586 18.0528606,16.0819686 16.4508979,17.4029496 Z M19.0211112,20.4681628 L17.7438102,18.929169 C19.7927036,17.2286725 21,14.7140097 21,12 C21,9.28974232 19.7960666,6.77820732 17.7520315,5.07766256 L19.031149,3.54017812 C21.5271817,5.61676443 23,8.68922234 23,12 C23,15.3153667 21.523074,18.3916375 19.0211112,20.4681628 Z M7.54910207,17.4029496 C5.94713944,16.0819686 5,14.1173586 5,12 C5,9.88958759 5.94090645,7.93073905 7.53388797,6.60963188 L8.81061588,8.14910121 C7.67104182,9.09418404 7,10.4912085 7,12 C7,13.5137472 7.67549895,14.9149052 8.82150222,15.8599014 L7.54910207,17.4029496 Z M4.9788888,20.4681628 C2.47692603,18.3916375 1,15.3153667 1,12 C1,8.68922234 2.47281829,5.61676443 4.96885102,3.54017812 L6.24796852,5.07766256 C4.20393339,6.77820732 3,9.28974232 3,12 C3,14.7140097 4.20729644,17.2286725 6.25618985,18.929169 L4.9788888,20.4681628 Z"
                  fill="#000000"
                  fillRule="nonzero"
                  opacity="0.3"
                ></path>
                <path
                  d="M11,14.2919782 C10.1170476,13.9061998 9.5,13.0251595 9.5,12 C9.5,10.6192881 10.6192881,9.5 12,9.5 C13.3807119,9.5 14.5,10.6192881 14.5,12 C14.5,13.0251595 13.8829524,13.9061998 13,14.2919782 L13,20 C13,20.5522847 12.5522847,21 12,21 C11.4477153,21 11,20.5522847 11,20 L11,14.2919782 Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
            <span className="font-bold text-xl text-gray-700">Live Sets</span>
          </div>
          <div className="grid grid-cols-4">
            <div className="border-4 border-green-800 rounded-full shadow-lg w-24 h-24 flex items-center justify-center flex-col ">
              <p className="text-accent text-sm ">Running</p>
              <p className="font-bold text-sm  text-gray-700">
                {running_gensets}
              </p>
            </div>
            <div className="border-4 border-orange-600 rounded-full shadow-lg w-24 h-24 flex items-center justify-center flex-col ">
              <p className="text-accent text-sm ">Warning</p>
              <p className="font-bold text-sm  text-gray-700">
                {warning_gensets}
              </p>
            </div>
            <div className="border-4 border-red-800 rounded-full shadow-lg w-24 h-24 flex items-center justify-center flex-col ">
              <p className="text-accent text-sm ">Servicing</p>
              <p className="font-bold text-sm  text-gray-700">
                {servicing_gensets ?? '---'}
              </p>
            </div>
            <div className="border-4 border-yellow-200 rounded-full shadow-lg w-24 h-24 flex items-center justify-center flex-col ">
              <p className="text-accent text-sm ">Inactive</p>
              <p className="font-bold text-sm  text-gray-700">
                {inactive_gensets}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-3 flex-col">
        <Map data={results} />
      </div>
    </div>
  );
}
