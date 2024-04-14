import React from 'react';
import 'react-phone-input-2/lib/high-res.css';
import PhoneInput, { CountryData } from 'react-phone-input-2';

import { FormMessage } from '../ui/form';
type Props = {
  country?: string;
  onChange: (value: string, country: CountryData) => void;
  value: string;
  message?: string;
};
const PhoneInput2 = ({ country, onChange, value, message }: Props) => {
  return (
    <div>
      <PhoneInput
        country={country ?? 'pk'}
        onChange={onChange}
        value={value}
        countryCodeEditable={false}
        inputClass="custom-phone-input"
      />
      <FormMessage>{message}</FormMessage>
    </div>
  );
};

export default PhoneInput2;
