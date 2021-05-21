import { useSelector } from 'react-redux'
import { getSyncing, getLastSync, getReleasesEntries } from 'state/selectors'
import { useRefChangeKey } from 'hooks'
import { VerticalLayout, Content } from 'components/common'
import { Filters } from 'components/filters'
import {
  SettingsModalContainer,
  ResetModalContainer,
  PlaylistModalContainer,
} from 'components/modals'
import ReleasesHeader from './ReleasesHeader'
import Intro from './Intro'
import Loading from './Loading'
import ReleaseList from './ReleaseList'

/**
 * Releases screen
 *
 * @param {RouteComponentProps} props
 */
function Releases(props) {
  const lastSync = useSelector(getLastSync)
  const syncing = useSelector(getSyncing)
  const releases = useSelector(getReleasesEntries)
  const releasesKey = useRefChangeKey(releases)

  const renderContent = () => {
    if (!lastSync) {
      return <Intro />
    }

    if (syncing) {
      return <Loading />
    }

    return <ReleaseList releases={releases} key={releasesKey} />
  }

  return (
    <VerticalLayout>
      <ReleasesHeader />
      <Filters />
      <Content>{renderContent()}</Content>
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
    </VerticalLayout>
  )
}

export default Releases
