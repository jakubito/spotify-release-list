import { useEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { addSeenFeature } from 'state/actions'
import { getSeenFeatures } from 'state/selectors'

/**
 * Modal hook
 *
 * @param {ActionCreator} hideModalAction
 * @returns {() => void} Close modal handler
 */
export function useModal(hideModalAction) {
  const dispatch = useDispatch()
  const closeModal = useCallback(() => {
    dispatch(hideModalAction())
  }, [])

  useHotkeys('esc', closeModal)

  useEffect(() => {
    document.documentElement.classList.add('is-modal-open')

    return () => {
      document.documentElement.classList.remove('is-modal-open')
    }
  }, [])

  return closeModal
}

/**
 * Feature hook
 *
 * @param {string} feature
 * @returns {[boolean, () => void]}
 */
export function useFeature(feature) {
  const dispatch = useDispatch()
  const seenFeatures = useSelector(getSeenFeatures)

  const seen = useMemo(() => seenFeatures.includes(feature), [seenFeatures])
  const setSeen = useCallback(() => {
    if (!seen) {
      dispatch(addSeenFeature(feature))
    }
  }, [seen])

  return [seen, setSeen]
}
