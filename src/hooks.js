import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateNonce, sleep } from './helpers';
import { setNonce, sync } from './actions';
import { startAuthFlow } from './oauth';
import { getToken, getTokenExpires } from './selectors';

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
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);

  return useCallback(async () => {
    if (token && tokenExpires && new Date().toISOString() < tokenExpires) {
      dispatch(sync());

      return;
    }

    const nonce = generateNonce();

    dispatch(setNonce(nonce));
    await sleep(500);
    startAuthFlow(nonce);
  }, [token, tokenExpires, dispatch]);
}
