'use client';
import { useFetchMapDriver } from '@/lib/dashboard/client/driver';

import Map from './_components/Map';

const Page = () => {
  const { data } = useFetchMapDriver({ status: 'Running' });
  const results = data?.results;
  return (
    <div>
      <Map data={results} />
    </div>
  );
};

export default Page;
