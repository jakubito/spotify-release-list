import { useSelector } from 'react-redux'
import { getHasAppData, getUser } from 'state/selectors'
import AlbumGroupsField from './AlbumGroupsField'
import MarketField from './MarketField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import DataReset from './DataReset'
import FirstDayOfWeekField from './FirstDayOfWeekField'
import FetchExtraDataField from './FetchExtraDataField'
import IncludeLikedSongsField from './IncludeLikedSongsField'
import LabelBlocklistField from './LabelBlocklistField'

/**
 * Render general settings fields
 */
function GeneralSettings() {
  const user = useSelector(getUser)
  const hasAppData = useSelector(getHasAppData)

  return (
    <div className="fade-in">
      <AlbumGroupsField />
      <FetchExtraDataField />
      <TimePeriodField />
      <MarketField />
      <FirstDayOfWeekField />
      <UriLinksField />
      <IncludeLikedSongsField />
      <LabelBlocklistField />
      {user && <DataInfo />}
      {hasAppData && <DataReset />}
    </div>
  )
}

export default GeneralSettings
