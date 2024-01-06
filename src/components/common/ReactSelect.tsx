import React from 'react';
import Select from 'react-select';
type Props = {
  value: any;
  onChange: (val: any) => void;
  options: any[];
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;

  className?: string;
  classNamePrefix?: string;
};

const ReactSelect = (props: Props) => {
  const {
    value,
    options,
    onChange,
    getOptionLabel,
    getOptionValue,
    className = 'my-react-select-container',
    classNamePrefix = 'my-react-select',
  } = props || {};
  return (
    <Select
      className={className}
      classNamePrefix={classNamePrefix}
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel} // Use 'type' as label
      getOptionValue={getOptionValue} // Use 'value' as value
    />
  );
};

export default ReactSelect;
