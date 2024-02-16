import * as React from 'react';

import { cn } from '@/utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{startIcon}</div>}
        <input
          type={type}
          className={cn(
            `flex h-14 w-full rounded-md border border-input bg-background ${
              startIcon ? 'pl-8' : 'pl-3'
            } pr-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        />
        {endIcon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{endIcon}</div>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
