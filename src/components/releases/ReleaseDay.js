import { memo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { getPreviousSyncMaxDate } from 'state/selectors'
import Album from './Album'

/**
 * Render single release day
 *
 * @param {{ date: string, albums: Album[] }} props
 */
function ReleaseDay({ date, albums }) {
  const previousSyncMaxDate = useSelector(getPreviousSyncMaxDate)

  return (
    <div className="ReleaseDay columns is-gapless">
      <div className="ReleaseDay__date column">
        {previousSyncMaxDate && date > previousSyncMaxDate && (
          <span className="ReleaseDay__bullet icon">
            <i className="fas fa-circle" />
          </span>
        )}
        {moment(date).format('MMMM D')}
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
