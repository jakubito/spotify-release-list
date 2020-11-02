import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { getLastSyncDate } from 'state/selectors'

/**
 * @param {(text: string) => any} setValue
 */
export function useLastSyncUpdater(setValue) {
  const lastSyncDate = useSelector(getLastSyncDate)

  useEffect(() => {
    const updateLastSyncHuman = () => {
      setValue(moment(lastSyncDate).fromNow())
    }

    const intervalId = setInterval(updateLastSyncHuman, 60 * 1000)
    window.addEventListener('focus', updateLastSyncHuman)
    updateLastSyncHuman()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', updateLastSyncHuman)
    }
  }, [lastSyncDate])
}
