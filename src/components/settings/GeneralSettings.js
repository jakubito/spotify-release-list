import { useSelector } from 'react-redux'
import { getHasAppData, getUser } from 'state/selectors'
import AlbumGroupsField from './AlbumGroupsField'
import MarketField from './MarketField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import DataReset from './DataReset'
import IncludeLikedSongsField from './IncludeLikedSongsField'

/**
 * Render general settings fields
 *
 * @param {RouteComponentProps} props
 */
function GeneralSettings(props) {
  const user = useSelector(getUser)
  const hasAppData = useSelector(getHasAppData)

  return (
    <div className="fade-in">
      <AlbumGroupsField />
      <TimePeriodField />
      <MarketField />
      <UriLinksField />
      <IncludeLikedSongsField />
      {user && <DataInfo />}
      {hasAppData && <DataReset />}
    </div>
  )
}

export default GeneralSettings
