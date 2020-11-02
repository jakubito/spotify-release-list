import React from 'react'
import { useSelector } from 'react-redux'
import { getSyncing, getLastSync } from 'state/selectors'
import Intro from './Intro'
import Loading from './Loading'
import Releases from './Releases'

/**
 * Render main content
 */
function Content() {
  const syncing = useSelector(getSyncing)
  const lastSync = useSelector(getLastSync)

  return (
    <div className="Content">
      {(() => {
        if (!lastSync) {
          return <Intro />
        }

        if (syncing) {
          return <Loading />
        }

        return <Releases />
      })()}
    </div>
  )
}

export default Content
