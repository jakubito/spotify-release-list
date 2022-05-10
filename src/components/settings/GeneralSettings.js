import { useSelector } from 'react-redux'
import { getUser } from 'state/selectors'
import ArtistSourcesField from './ArtistSourcesField'
import AlbumGroupsField from './AlbumGroupsField'
import MarketField from './MarketField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import FirstDayOfWeekField from './FirstDayOfWeekField'
import FetchExtraDataField from './FetchExtraDataField'
import LabelBlocklistField from './LabelBlocklistField'
import MinimumSavedTracksField from './MinimumSavedTracksField'

/**
 * Render general settings fields
 */
function GeneralSettings() {
  const user = useSelector(getUser)

  return (
    <div className="fade-in">
      <ArtistSourcesField />
      <MinimumSavedTracksField />
      <AlbumGroupsField />
      <FetchExtraDataField />
      <TimePeriodField />
      <MarketField />
      <FirstDayOfWeekField />
      <UriLinksField />
      <LabelBlocklistField />
      {user && <DataInfo />}
    </div>
  )
}

export default GeneralSettings
