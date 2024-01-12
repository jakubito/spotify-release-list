import { useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import {
  getSyncing,
  getUser,
  getReleases,
  getWorking,
  getEditingFavorites,
  getLastSettingsPath,
} from 'state/selectors'
import { useDynamicKey } from 'hooks'
import { deferred, modalsClosed } from 'helpers'
import { VerticalLayout, Content, Centered } from 'components/common'
import { Filters } from 'components/filters'
import { PlaylistModalContainer } from 'components/modals'
import ReleasesHeader from './ReleasesHeader'
import Intro from './Intro'
import Loading from './Loading'
import ReleaseList from './ReleaseList'

/**
 * Releases screen
 */
function Releases() {
  const navigate = useNavigate()
  const user = useSelector(getUser)
  const working = useSelector(getWorking)
  const syncing = useSelector(getSyncing)
  const editingFavorites = useSelector(getEditingFavorites)
  const lastSettingsPath = useSelector(getLastSettingsPath)
  const releases = useSelector(getReleases)
  const listKey = useDynamicKey([editingFavorites, releases])

  useHotkeys('s', deferred(navigate, lastSettingsPath || '/settings'), {
    enabled: () => !working && modalsClosed(),
  })

  const renderContent = () => {
    if (!user) {
      return (
        <Centered>
          <Intro />
        </Centered>
      )
    }

    if (syncing) {
      return (
        <Centered>
          <Loading />
        </Centered>
      )
    }

    if (!releases.length) {
      return <Centered>No albums to display</Centered>
    }

    return <ReleaseList releases={releases} key={listKey} />
  }

  return (
    <VerticalLayout>
      <ReleasesHeader />
      <Filters />
      <Content>{renderContent()}</Content>
      <PlaylistModalContainer />
    </VerticalLayout>
  )
}

export default Releases
