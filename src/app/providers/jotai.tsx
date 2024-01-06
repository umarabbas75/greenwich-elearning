'use client';
import { Provider } from 'jotai';

export default function JotaiProvider({ children }: any) {
  return <Provider>{children}</Provider>;
}
