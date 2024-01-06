import { useState } from 'react';
const useModal = () => {
  const [open, setOpen] = useState(false);
  const [additionalState, setAdditionalState] = useState('');

  const openModal = (value = '') => {
    setOpen(true);
    setAdditionalState(value);
  };

  const closeModal = () => {
    setOpen(false);
    setAdditionalState('');
  };

  return { open, additionalState, openModal, closeModal };
};
export default useModal;
