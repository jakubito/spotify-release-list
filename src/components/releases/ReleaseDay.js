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
    <div className="ReleaseDay columns is-gapless has-text-grey">
      <div className="column is-size-4 date">
        {previousSyncMaxDate && date > previousSyncMaxDate && <span className="new">• </span>}
        {moment(date).format('MMMM D')}
      </div>
      <div className="column albums">
        {albums.map((album) => (
          <Album album={album} key={album.id} />
        ))}
      </div>
    </div>
  )
}

export default memo(ReleaseDay)
