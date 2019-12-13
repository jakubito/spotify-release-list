import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { generateNonce } from './helpers';
import { setNonce } from './actions';
import { startAuthFlow } from './oauth';

export function useModal(hideModal) {
  const dispatch = useDispatch();
  const closeModal = useCallback(() => dispatch(hideModal()), [dispatch, hideModal]);

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

export function useAuthorize() {
  const dispatch = useDispatch();

  return useCallback(() => {
    const nonce = generateNonce();

    dispatch(setNonce(nonce));
    startAuthFlow(nonce);
  }, [dispatch]);
}
