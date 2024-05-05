import React from 'react';
import Select from 'react-select';
type Props = {
  value: any;
  onChange: (val: any) => void;
  options: any[];
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
  isMulti: boolean;
  className?: string;
  classNamePrefix?: string;
  placeholder?: string;
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
    placeholder = 'Select',
    isMulti = false,
  } = props || {};
  return (
    <Select
      className={className}
      classNamePrefix={classNamePrefix}
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      getOptionLabel={getOptionLabel} // Use 'type' as label
      getOptionValue={getOptionValue} // Use 'value' as value
      isMulti={isMulti}
    />
  );
};

export default ReactSelect;
