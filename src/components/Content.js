import { useSelector } from 'react-redux'
import { getSyncing, getLastSync, getReleasesEntries } from 'state/selectors'
import { Intro, Loading, Releases } from 'components'
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
