import { useTheme } from 'next-themes';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Icons } from '@/utils/icon';

type feature = {
  description: string;
  id: number;
  name: string;
  logo: string;
};

type props = {
  item: feature;
  field: any;
  edit?: boolean;
};
//type ValidIconNames = keyof typeof Icons;
const FeatureFormItem = ({ item, field, edit }: props) => {
  const { theme } = useTheme();
  const { onChange, value } = field || {};
  //const iconName = item?.icon as ValidIconNames;
  console.log({ value, item });
  return (
    <FormItem
      key={item.id}
      className="flex flex-row  space-x-3 space-y-0 items-center"
    >
      <FormControl>
        <Checkbox
          checked={value?.includes(item.id)}
          disabled={!edit}
          onCheckedChange={(checked) => {
            return checked
              ? onChange([...value, item.id])
              : onChange(value?.filter((value: any) => value !== item.id));
          }}
        />
      </FormControl>
      <FormLabel className="font-normal cursor-pointer text-base flex gap-4 items-center flex-1">
        <span className="flex-1 capitalize">{item.name}</span>
        <div className="flex-1">
          {item.logo ? (
            <img src={item.logo} alt="" className="w-6 h-8" />
          ) : (
            <Icons
              className="w-6 h-8"
              iconName="frequency"
              fill={theme === 'dark' || !theme ? '#ffffff' : '#71717a'}
            />
          )}
          {/* <Icons
            className="w-6 h-8"
            iconName="customer"
            fill={theme === 'dark' || !theme ? '#ffffff' : '#71717a'}
          /> */}
        </div>
      </FormLabel>
    </FormItem>
  );
};

export default FeatureFormItem;
