import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSeenFeature } from 'actions';
import { getSeenFeatures } from 'selectors';

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

export function useFeature(feature) {
  const dispatch = useDispatch();
  const seenFeatures = useSelector(getSeenFeatures);

  const seen = useMemo(() => seenFeatures.includes(feature), [seenFeatures]);
  const setSeen = useCallback(() => {
    if (!seen) {
      dispatch(addSeenFeature(feature));
    }
  }, [seen]);

  return [seen, setSeen];
}
