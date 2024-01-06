import { AxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type props = {
  title?: string;
  error: any;
};

export function AlertDestructive({ title = 'Error', error }: props) {
  function transformObjectToArray(obj: any) {
    return Object.keys(obj).map((key) => {
      const value = Array.isArray(obj[key]) ? obj[key][0] : obj[key];
      return `${key}: ${value}`;
    });
  }
  const renderError = (error: AxiosError) => {
    console.log('error', error);
    if (error.request)
      return (
        <p>
          {error?.message ??
            'Network error. Please check your internet connection.'}{' '}
        </p>
      );
    else if (error.response) {
      const value = error.response.data;
      const result = transformObjectToArray(value);

      return result.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    } else {
      return <p>An error occurred while processing your request.</p>;
    }
  };
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{renderError(error)}</AlertDescription>
    </Alert>
  );
}
