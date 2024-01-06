'use client';

import { useAtom } from 'jotai';
import { Database } from 'lucide-react';
import { useState } from 'react';

import ErrorComponent from '@/components/common/Error';
import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { useFetchSubscriptionList } from '@/lib/dashboard/client/subscription';
import { subscriptionModalAtom } from '@/store/modals';
import useDebounce from '@/utils/hooks/useDebounce';

import SubscriptionModal from './_components/SubscriptionModal';
import SubscriptionTable from './_components/SubscriptionTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [subscriptionState, setSubscriptionState] = useAtom(
    subscriptionModalAtom,
  );
  const { data, isLoading, error, isError } = useFetchSubscriptionList({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
  });

  // if (isError) {
  //   toast({
  //     variant: 'destructive',

  //     description: error?.message,
  //   });
  // }

  if (isError) {
    return <ErrorComponent errorMessage={(error as Error).message} />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="flex justify-start"></div>
        <div className="flex justify-end">
          <div className="flex gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                setSubscriptionState({
                  status: true,
                  data: null,
                })
              }
            >
              Add New Subscription
            </Button>
          </div>
        </div>
      </div>
      {data?.results?.length > 0 ? (
        <SubscriptionTable
          data={data ?? []}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex item-center justify-center">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
            <Database />
          </div>
        </div>
      )}

      {subscriptionState.status && <SubscriptionModal />}
    </div>
  );
};

export default Page;
