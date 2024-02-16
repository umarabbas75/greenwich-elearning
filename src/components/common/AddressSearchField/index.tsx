import React, { useState } from 'react';
import Select from 'react-select';

import { useFetchAddressList } from '@/lib/dashboard/client/seriveDealer';
import useDebounce from '@/utils/hooks/useDebounce';
type Props = {
  className?: string;
  classNamePrefix?: string;
  onChange: any;
  value: any;
};

const AddressSearchField = (props: Props) => {
  const [search, setsearch] = useState('');
  const [key, setKey] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useFetchAddressList({
    search: debouncedSearch,
  });
  console.log('address_search', data);
  const onChange = (val: any) => {
    setKey(key + 1);
    props.onChange(val);
  };
  const options: any = data || [];
  const { className = 'my-react-select-container', classNamePrefix = 'my-react-select', value } = props || {};
  return (
    <Select
      key={key}
      isLoading={isLoading}
      isClearable={true}
      className={className}
      classNamePrefix={classNamePrefix}
      onInputChange={(val) => setsearch(val)}
      filterOption={() => true}
      value={value}
      inputValue={search}
      options={options}
      onChange={onChange}
      getOptionLabel={(option: any) => option.display_name} // Use 'type' as label
      getOptionValue={(option: any) => option.display_name} // Use 'value' as value
    />
  );
};

export default AddressSearchField;
