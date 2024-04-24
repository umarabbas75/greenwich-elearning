import { atom } from 'jotai';

export const selectedSectionAtom = atom<any>({
  data: null,
});

export const selectedAnswerAtom = atom<any>('');
export const courseProgressAtom = atom<any>('');
