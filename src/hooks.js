import { useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { addSeenFeature } from 'state/actions'
import { getSeenFeatures } from 'state/selectors'
import { deferred } from 'helpers'

/**
 * Modal hook
 *
 * @param {() => void} closeModal
 */
export function useModal(closeModal) {
  useHotkeys('esc', closeModal, { enableOnFormTags: ['input'] })

  useEffect(() => {
    document.documentElement.classList.add('is-modal-open')

    return () => {
      document.documentElement.classList.remove('is-modal-open')
    }
  }, [])
}

/**
 * Feature hook
 *
 * @param {string} feature
 */
export function useFeature(feature) {
  const dispatch = useDispatch()
  const seenFeatures = useSelector(getSeenFeatures)
  const seen = seenFeatures.includes(feature)
  const setSeen = deferred(() => {
    if (!seen) {
      dispatch(addSeenFeature(feature))
    }
  })

  return { seen, setSeen }
}

/**
 * Returns a dynamic key that changes on every dependency change
 *
 * @param {import('react').DependencyList} dependencyList
 */
export function useDynamicKey(dependencyList) {
  const keyRef = useRef(0)
  return useMemo(() => (keyRef.current = 1 - keyRef.current), dependencyList)
}

/**
 * Call `handler` when clicked outside of `ref`
 *
 * @param {React.MutableRefObject} ref
 * @param {(event: MouseEvent) => void} handler
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    let startedInside = false

    /** @type {(event: MouseEvent | TouchEvent) => void} */
    const interactionListener = (event) => {
      startedInside = ref.current?.contains(event.target)
    }

    /** @type {(event: MouseEvent) => void} */
    const clickListener = (event) => {
      if (!ref.current) return
      if (ref.current.contains(event.target)) return
      if (startedInside) return

      handler(event)
    }

    document.addEventListener('mousedown', interactionListener)
    document.addEventListener('touchstart', interactionListener)
    document.addEventListener('click', clickListener)

    return () => {
      document.removeEventListener('mousedown', interactionListener)
      document.removeEventListener('touchstart', interactionListener)
      document.removeEventListener('click', clickListener)
    }
  }, [])
}

/**
 * Call `handler` when focused outside of `ref`
 *
 * @param {React.MutableRefObject} ref
 * @param {(event: FocusEvent) => void} handler
 */
export function useFocusOutside(ref, handler) {
  useEffect(() => {
    /** @type {(event: FocusEvent) => void} */
    const focusListener = (event) => {
      if (!ref.current) return
      if (ref.current.contains(event.target)) return

      handler(event)
    }

    document.addEventListener('focusin', focusListener)

    return () => {
      document.removeEventListener('focusin', focusListener)
    }
  }, [])
}
