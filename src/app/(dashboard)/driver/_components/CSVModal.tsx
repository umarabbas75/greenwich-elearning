import { FileDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

import { Button } from '@/components/ui/button';
import { useFetchDriverList } from '@/lib/dashboard/client/driver';

const CSVModal = () => {
  const [csvData, setCsvData] = useState(false);
  const csvInstance = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  const { data } = useFetchDriverList();

  useEffect(() => {
    if (csvData && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        if (csvInstance.current?.link?.click) {
          csvInstance.current?.link?.click();
        }
        setCsvData(false);
      });
    }
  }, [csvData]);

  return (
    <div>
      <Button
        className="flex items-center gap-2"
        onClick={() => {
          const csvData = data?.results?.map((item: any) => {
            return {
              'Driver Name': item.name,
              'Customer Name': item.customer,
              Status: item.status,
              'Start Location': item.start_location?.display_name ?? '---',
              'End Location': item.end_location?.display_name ?? '---',
              'Start Date': item.created_at?.toString() ?? '---',
              'End Date': item.end_datetime?.toString() ?? '---',
            };
          });

          setCsvData(csvData);
        }}
      >
        <FileDown className="h-6 w-6" />
        Export CSV
      </Button>

      {csvData ? (
        <CSVLink
          data={csvData as any}
          //headers={['Date', 'Name', 'Amount', 'Admin Fee', 'Service Charges']}
          filename={'driver_reports.csv'}
          ref={csvInstance}
        />
      ) : undefined}
    </div>
  );
};

export default CSVModal;
