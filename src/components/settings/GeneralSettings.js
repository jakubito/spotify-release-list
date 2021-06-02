import { useSelector } from 'react-redux'
import { getLastSync } from 'state/selectors'
import AlbumGroupsField from './AlbumGroupsField'
import MarketField from './MarketField'
import TimePeriodField from './TimePeriodField'
import UriLinksField from './UriLinksField'
import DataInfo from './DataInfo'
import DataReset from './DataReset'

/**
 * Render general settings fields
 *
 * @param {RouteComponentProps} props
 */
function GeneralSettings(props) {
  const lastSync = useSelector(getLastSync)

  return (
    <div className="fade-in">
      <AlbumGroupsField />
      <TimePeriodField />
      <MarketField />
      <UriLinksField />
      {lastSync && (
        <>
          <DataInfo />
          <DataReset />
        </>
      )}
    </div>
  )
}

export default GeneralSettings
