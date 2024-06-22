import React from 'react';

import { cn } from '@/utils/utils';

const NameInitials = ({ initials, className, ...rest }: any) => {
  return (
    <div
      {...rest}
      className={cn(
        `h-20 w-20 cursor-pointer rounded-full bg-primary flex items-center justify-center text-white uppercase text-3xl font-semibold`,
        className,
      )}
    >
      {initials}
    </div>
  );
};

export default NameInitials;
