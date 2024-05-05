import { useAtom } from 'jotai';
import { ArrowDown, Clock10 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Clock from 'react-live-clock';
import { useQueryClient } from 'react-query';

import ReactSelect from '@/components/common/ReactSelect';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { userTimezoneAtom } from '@/store/course';
const WorldClock = () => {
  const { data: session } = useSession();
  const [userTimezoneState] = useAtom(userTimezoneAtom);
  console.log({ userTimezoneState });
  const timezoneOptions = [
    { label: 'US/Pacific', value: 'US/Pacific' },
    { label: 'US/Eastern', value: 'US/Eastern' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
    { label: 'Australia/Sydney', value: 'Australia/Sydney' },
    { label: 'Africa/Johannesburg', value: 'Africa/Johannesburg' },
    { label: 'America/Sao_Paulo', value: 'America/Sao_Paulo' },
    { label: 'Asia/Dubai', value: 'Asia/Dubai' },
    { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
    { label: 'Asia/Karachi', value: 'Asia/Karachi' },
    { label: 'America/Chicago', value: 'America/Chicago' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'America/Denver', value: 'America/Denver' },
    { label: 'America/Phoenix', value: 'America/Phoenix' },
    { label: 'America/Anchorage', value: 'America/Anchorage' },
    { label: 'Pacific/Honolulu', value: 'Pacific/Honolulu' },
    { label: 'Europe/Berlin', value: 'Europe/Berlin' },
    { label: 'Europe/Madrid', value: 'Europe/Madrid' },
    { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
    { label: 'Asia/Singapore', value: 'Asia/Singapore' },
    { label: 'America/Toronto', value: 'America/Toronto' },
    { label: 'America/Vancouver', value: 'America/Vancouver' },
    { label: 'America/Mexico_City', value: 'America/Mexico_City' },
    { label: 'America/Bogota', value: 'America/Bogota' },
    { label: 'America/Buenos_Aires', value: 'America/Buenos_Aires' },
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'Europe/Lisbon', value: 'Europe/Lisbon' },
    { label: 'Europe/Moscow', value: 'Europe/Moscow' },
    { label: 'Asia/Dubai', value: 'Asia/Dubai' },
    { label: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
    { label: 'Asia/Bangkok', value: 'Asia/Bangkok' },
    { label: 'Asia/', value: 'Asia/Kolkata' },
    { label: 'Asia/Seoul', value: 'Asia/Seoul' },
    { label: 'Australia/Sydney', value: 'Australia/Sydney' },
    { label: 'Australia/Melbourne', value: 'Australia/Melbourne' },
    // Add more timezone options as needed
  ];
  const [selectedTimezone, setSelectedTimezone] = useState(
    userTimezoneState || Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  useEffect(() => {
    if (userTimezoneState) {
      setSelectedTimezone(userTimezoneState);
    }
  }, [userTimezoneState]);

  console.log('user', session?.user);
  const queryClient = useQueryClient();
  // Function to handle timezone change
  const handleTimezoneChange = (timezone: any) => {
    setSelectedTimezone(timezone.value);
    const payload = {
      timezone: timezone.value,
    };
    editUser(payload);
  };
  const { mutate: editUser } = useApiMutation<any>({
    endpoint: `/users/${session?.user?.id}`,
    method: 'put',
    config: {
      select: (res) => res?.data,
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: ['get-user'],
        });

        toast({
          variant: 'success',
          title: 'Timezone updated',
        });
      },
    },
  });
  console.log({ selectedTimezone });

  return (
    <div className="">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary">World Clock</h2>
        <div className="flex items-center gap-4 justify-between">
          <div>
            <p className="text-gray-700 font-medium">
              {new Date()?.toLocaleDateString('en-US', { timeZone: selectedTimezone, weekday: 'long' })}
            </p>
            <p className="text-gray-700 font-medium">
              {new Date()?.toLocaleDateString('en-US', {
                timeZone: selectedTimezone,
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="text-gray-700 font-medium">{selectedTimezone}</p>
          </div>
          <Clock
            format={'HH:mm:ss'}
            ticking={true}
            timezone={selectedTimezone}
            className="text-white py-3 px-5 bg-[#4d4a4a] rounded-md  text-3xl font-medium"
          />
        </div>
      </div>
      <div className="bg-gray-200 px-6 py-6">
        <p className="text-themeBlue flex items-center font-bold cursor-pointer">
          Set home location <ArrowDown />{' '}
        </p>
        <div className="flex gap-2 items-center">
          <Clock10 className="w-12 h-12" />
          <ReactSelect
            value={timezoneOptions.find((option) => option.value === selectedTimezone)}
            onChange={handleTimezoneChange}
            isMulti={false}
            options={timezoneOptions}
            className="w-full"
            placeholder="Select timezone"
          />
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
