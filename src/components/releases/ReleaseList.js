import { useMemo, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { calculatePageSize } from 'helpers'
import FavoritesToolbar from './FavoritesToolbar'
import ReleaseDay from './ReleaseDay'

/**
 * Lazily render releases sorted by date
 *
 * @param {{ releases: Releases }} props
 */
function ReleaseList({ releases }) {
  const { clientWidth, clientHeight } = document.body
  const pageSize = useMemo(() => calculatePageSize(clientWidth, clientHeight), [])
  const { cursor, slice, next, reset } = usePaginate(releases, pageSize)

  return (
    <>
      <FavoritesToolbar resetList={reset} />
      {slice.map(({ date, albums }) => (
        <ReleaseDay date={date} albums={albums} key={date} />
      ))}
      {next && <Waypoint bottomOffset="-50%" onEnter={next} key={cursor} />}
    </>
  )
}

/**
 * Releases pagination hook
 *
 * @param {Releases} releases
 * @param {number} pageSize - Page size threshold
 */
function usePaginate(releases, pageSize) {
  function nextCursor(currentCursor = 0) {
    let newCursor = currentCursor
    let pageCount = 0

    for (const { albums } of releases.slice(currentCursor)) {
      pageCount += albums.length
      newCursor += 1

      if (pageCount > pageSize) {
        return newCursor
      }
    }

    return newCursor
  }

  const [cursor, setCursor] = useState(nextCursor)
  const slice = releases.slice(0, cursor)
  const next = cursor < releases.length ? () => setCursor(nextCursor) : null
  const reset = () => setCursor(nextCursor())

  return { cursor, slice, next, reset }
}

export default ReleaseList
