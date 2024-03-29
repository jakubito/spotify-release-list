import { useSelector } from 'react-redux'
import { getHasAppData, getUser } from 'state/selectors'
import ArtistSourcesField from './ArtistSourcesField'
import AlbumGroupsField from './AlbumGroupsField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import DataReset from './DataReset'
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
  const hasAppData = useSelector(getHasAppData)

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
      {hasAppData && <DataReset />}
    </div>
  )
}

export default GeneralSettings
