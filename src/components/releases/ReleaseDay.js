import { memo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { getPreviousSyncMaxDate, getSettings } from 'state/selectors'
import { albumsHistory, albumsNew } from 'albums'
import Album from './Album'

/**
 * Render single release day
 *
 * @param {{ date: string, albums: Album[] }} props
 */
function ReleaseDay({ date, albums }) {
  const { trackHistory } = useSelector(getSettings)
  const previousSyncMaxDate = useSelector(getPreviousSyncMaxDate)
  const isOlderThanYear = moment(date).isBefore(moment().subtract(1, 'year'))
  const dateFormat = isOlderThanYear ? 'MMM D, YYYY' : 'MMMM D'

  const showBullet = () => {
    if (trackHistory) {
      if (albumsNew.size === 0) return false
      if (albumsHistory.size === 0) return false
      for (const album of albums) {
        if (albumsNew.has(album.id)) return true
      }
      return false
    }
    if (!previousSyncMaxDate) return false
    return date > previousSyncMaxDate
  }

  return (
    <div className="ReleaseDay columns is-gapless">
      <div className="ReleaseDay__date column" title={date}>
        {showBullet() && (
          <span className="ReleaseDay__bullet icon">
            <i className="fas fa-circle" />
          </span>
        )}
        {moment(date).format(dateFormat)}
      </div>
      <div className="ReleaseDay__albums column">
        {albums.map((album) => (
          <Album album={album} key={album.id} />
        ))}
      </div>
    </div>
  )
}

export default memo(ReleaseDay)
