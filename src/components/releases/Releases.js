import { useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { navigate } from '@reach/router'
import { getSyncing, getUser, getReleasesEntries, getWorking } from 'state/selectors'
import { useRefChangeKey } from 'hooks'
import { deferred } from 'helpers'
import { VerticalLayout, Content, Centered } from 'components/common'
import { Filters } from 'components/filters'
import { PlaylistModalContainer } from 'components/modals'
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
  const user = useSelector(getUser)
  const working = useSelector(getWorking)
  const syncing = useSelector(getSyncing)
  const releases = useSelector(getReleasesEntries)
  const key = useRefChangeKey(releases)

  useHotkeys('s', deferred(navigate, '/settings'), { enabled: !working })

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

    return <ReleaseList releases={releases} key={key} />
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
