import { atom } from 'jotai';

const createModalAtom = () => {
  const modalAtom = atom<{ status: boolean; data: any }>({
    status: false,
    data: null,
  });

  return modalAtom;
};

export const userModalAtom = createModalAtom();
export const confirmationModalAtom = createModalAtom();
export const sessionExpireModalAtom = createModalAtom();
export const sideBarDrawerAtom = createModalAtom();
export const addCourseModalAtom = createModalAtom();
export const addModuleModalAtom = createModalAtom();
export const addChapterModalAtom = createModalAtom();
export const addSectionModalAtom = createModalAtom();

export const currenySignAtom = atom({
  currencySign: '€',
  currencyName: 'EUR',
  countryCode: 'nl',
});
