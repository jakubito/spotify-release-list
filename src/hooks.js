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
  useHotkeys('esc', closeModal, { enableOnTags: ['INPUT'] })

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
 * @returns {{ seen: boolean, setSeen: () => void }}
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

/**
 * Call `handler` when clicked outside of `ref`
 *
 * Taken from https://codesandbox.io/s/opmco?file=/src/useClickOutside.js
 * Improved version of https://usehooks.com/useOnClickOutside/
 *
 * @param {React.MutableRefObject} ref
 * @param {(event: MouseEvent) => void} handler
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    let startedWhenMounted = false
    let startedInside = false

    /** @type {(event: MouseEvent) => void} */
    const listener = (event) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return

      handler(event)
    }

    /** @type {(event: MouseEvent | TouchEvent) => void} */
    const validateEventStart = (event) => {
      startedWhenMounted = ref.current
      startedInside = ref.current && ref.current.contains(event.target)
    }

    document.addEventListener('mousedown', validateEventStart)
    document.addEventListener('touchstart', validateEventStart)
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('mousedown', validateEventStart)
      document.removeEventListener('touchstart', validateEventStart)
      document.removeEventListener('click', listener)
    }
  }, [ref])
}
