import { useEffect, useState } from 'react'
import moment from 'moment'

/**
 * Auto update last sync information every minute and when focused
 *
 * @param {Date} lastSyncDate
 */
export function useLastSync(lastSyncDate) {
  const [lastSync, setLastSync] = useState(moment(lastSyncDate).fromNow())

  useEffect(() => {
    const updateLastSync = () => {
      setLastSync(moment(lastSyncDate).fromNow())
    }

    const intervalId = setInterval(updateLastSync, 60 * 1000)
    window.addEventListener('focus', updateLastSync)
    updateLastSync()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', updateLastSync)
    }
  }, [lastSyncDate])

  return lastSync
}
