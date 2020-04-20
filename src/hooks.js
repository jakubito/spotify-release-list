import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useModal(hideModalAction) {
  const dispatch = useDispatch();
  const closeModal = useCallback(() => {
    dispatch(hideModalAction());
  }, []);

  useEffect(() => {
    const escHandler = ({ key }) => {
      if (['Esc', 'Escape'].includes(key)) {
        closeModal();
      }
    };

    window.addEventListener('keydown', escHandler);
    document.documentElement.classList.add('is-modal-open');

    return () => {
      window.removeEventListener('keydown', escHandler);
      document.documentElement.classList.remove('is-modal-open');
    };
  }, []);

  return closeModal;
}
