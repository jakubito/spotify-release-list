import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useModal(hideModal) {
  const dispatch = useDispatch();
  const closeModal = useCallback(
    (event) => {
      if (event) {
        event.preventDefault();
      }

      dispatch(hideModal());
    },
    [dispatch, hideModal]
  );

  useEffect(() => {
    const escHandler = ({ key }) => {
      if (['Esc', 'Escape'].includes(key)) {
        closeModal();
      }
    };

    window.addEventListener('keydown', escHandler);
    document.documentElement.classList.add('is-clipped');

    return () => {
      window.removeEventListener('keydown', escHandler);
      document.documentElement.classList.remove('is-clipped');
    };
  }, [closeModal]);

  return closeModal;
}
