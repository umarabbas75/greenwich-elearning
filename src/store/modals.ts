import { atom } from 'jotai';

const createModalAtom = () => {
  const modalAtom = atom<{ status: boolean; data: any }>({
    status: false,
    data: null,
  });

  return modalAtom;
};

export const categoryModalAtom = createModalAtom();
export const serviceDealerModalAtom = createModalAtom();
export const userModalAtom = createModalAtom();
export const gensetModalAtom = createModalAtom();
export const qrCodeModalAtom = createModalAtom();
export const gensetTypeModalAtom = createModalAtom();
export const customerModalAtom = createModalAtom();
export const subscriptionModalAtom = createModalAtom();
export const subscriptionListModalAtom = createModalAtom();
export const confirmationModalAtom = createModalAtom();
export const uploadCsvModal = createModalAtom();
export const sessionExpireModalAtom = createModalAtom();
export const sideBarDrawerAtom = createModalAtom();
export const warningDetailAtom = createModalAtom();

export const currenySignAtom = atom({
  currencySign: '€',
  currencyName: 'EUR',
  countryCode: 'nl',
});
