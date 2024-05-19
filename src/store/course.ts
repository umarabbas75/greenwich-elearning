import { atom } from 'jotai';

export const selectedSectionAtom = atom<any>({
  data: null,
});

export const lastSelectedSectionAtom = atom<any>('');
export const selectedAnswerAtom = atom<any>('');
export const courseProgressAtom = atom<any>('');
export const userPhotoAtom = atom<any>('');
export const userTimezoneAtom = atom<any>('');
export const sideBarWidthAtom = atom<any>('lg');
