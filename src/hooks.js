import { useEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { addSeenFeature, sync, setSyncing, setNonce } from 'actions'
import { getSeenFeatures, getWorking, getToken, getTokenExpires, getTokenScope } from 'selectors'
import { isValidSyncToken, startSyncAuthFlow } from 'auth'
import { generateNonce } from 'helpers'
import { persistor } from 'state'

/**
 * Sync trigger hook
 *
 * @returns {() => void} Sync trigger handler
 */
export function useSync() {
  const dispatch = useDispatch()
  const working = useSelector(getWorking)
  const token = useSelector(getToken)
  const tokenExpires = useSelector(getTokenExpires)
  const tokenScope = useSelector(getTokenScope)

  const syncTrigger = useCallback(async () => {
    if (working) {
      return
    }

    if (isValidSyncToken(token, tokenExpires, tokenScope)) {
      dispatch(sync())
    } else {
      const nonce = generateNonce()

      dispatch(setSyncing(true))
      dispatch(setNonce(nonce))

      await persistor.flush()

      startSyncAuthFlow(nonce)
    }
  }, [working, token, tokenExpires, tokenScope])

  return syncTrigger
}

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
