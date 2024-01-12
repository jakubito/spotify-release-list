import { useSelector } from 'react-redux'
import { getUser } from 'state/selectors'
import ArtistSourcesField from './ArtistSourcesField'
import AlbumGroupsField from './AlbumGroupsField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import FirstDayOfWeekField from './FirstDayOfWeekField'
import FetchExtraDataField from './FetchExtraDataField'
import LabelBlocklistField from './LabelBlocklistField'
import ArtistBlocklistField from './ArtistBlocklistField'
import MinimumSavedTracksField from './MinimumSavedTracksField'
import HistoryField from './HistoryField'

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
      <FirstDayOfWeekField />
      <UriLinksField />
      <HistoryField />
      <LabelBlocklistField />
      <ArtistBlocklistField />
      {user && <DataInfo />}
    </div>
  )
}

export default GeneralSettings
