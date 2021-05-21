import { useEffect, useRef, useMemo } from 'react'
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
  const closeModal = () => {
    dispatch(hideModalAction())
  }

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
 * @returns {{ seen: boolean, setSeen: () => void }}
 */
export function useFeature(feature) {
  const dispatch = useDispatch()
  const seenFeatures = useSelector(getSeenFeatures)

  const seen = seenFeatures.includes(feature)
  const setSeen = () => {
    dispatch(addSeenFeature(feature))
  }

  return { seen, setSeen }
}

/**
 * Return different key on every value change
 *
 * @param {any} value
 * @returns {number}
 */
export function useRefChangeKey(value) {
  const keyRef = useRef(0)
  const key = useMemo(() => (keyRef.current = 1 - keyRef.current), [value])

  return key
}
