'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2 items-center">
              {props.variant === 'success' && <CheckCircle2 />}
              {props.variant === 'destructive' && <XCircle />}
              <div>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription className="font-normal">{description}</ToastDescription>}
              </div>
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
