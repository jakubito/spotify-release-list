import React from 'react'
import { useSelector } from 'react-redux'
import { getSyncing, getLastSync, getReleasesEntries } from 'state/selectors'
import Intro from 'components/Intro'
import Loading from 'components/Loading'
import Releases from 'components/Releases'
import { useRefChangeKey } from 'hooks'

/**
 * Render main content
 */
function Content() {
  const syncing = useSelector(getSyncing)
  const lastSync = useSelector(getLastSync)
  const releases = useSelector(getReleasesEntries)
  const releasesKey = useRefChangeKey(releases)

  return (
    <div className="Content">
      {(() => {
        if (!lastSync) {
          return <Intro />
        }

        if (syncing) {
          return <Loading />
        }

        return <Releases releases={releases} key={releasesKey} />
      })()}
    </div>
  )
}

export default Content
