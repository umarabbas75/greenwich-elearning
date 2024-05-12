import { atom } from 'jotai';

const createModalAtom = () => {
  const modalAtom = atom<{ status: boolean; data: any }>({
    status: false,
    data: null,
  });

  return modalAtom;
};

export const userModalAtom = createModalAtom();
export const todoModalAtom = createModalAtom();
export const updatePasswordModalAtom = createModalAtom();
export const forumModalAtom = createModalAtom();
export const viewUserCoursesModal = createModalAtom();
export const viewAssignedQuizzesModal = createModalAtom();
export const confirmationModalAtom = createModalAtom();
export const unAssignQuizModalAtom = createModalAtom();
export const unAssignCourseModalAtom = createModalAtom();
export const createNewPostModalAtom = createModalAtom();
export const updateStatusModalAtom = createModalAtom();
export const sessionExpireModalAtom = createModalAtom();
export const sideBarDrawerAtom = createModalAtom();
export const courseDrawerAtom = createModalAtom();
export const addCourseModalAtom = createModalAtom();
export const addModuleModalAtom = createModalAtom();
export const addChapterModalAtom = createModalAtom();
export const addSectionModalAtom = createModalAtom();
export const assignCoursesModalAtom = createModalAtom();
export const assignQuizzesModalAtom = createModalAtom();

export const currenySignAtom = atom({
  currencySign: '€',
  currencyName: 'EUR',
  countryCode: 'nl',
});
