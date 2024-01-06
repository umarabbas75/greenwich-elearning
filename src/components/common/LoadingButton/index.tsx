import React from 'react';

import Spinner from '@/components/common/Spinner';
import { Button, ButtonProps } from '@/components/ui/button';

const LoadingButton = ({
  children,
  onClick,
  loading,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
} & ButtonProps) => {
  return (
    <Button
      {...props}
      onClick={() => !loading && onClick && onClick()}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </Button>
  );
};

export default LoadingButton;
