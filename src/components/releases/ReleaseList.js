import { useState } from 'react'
import { Waypoint } from 'react-waypoint'
import ReleaseDay from './ReleaseDay'

/**
 * Lazily render releases sorted by date
 *
 * @param {{ releases: ReleasesEntries }} props
 */
function ReleaseList({ releases }) {
  const { cursor, slice, next } = usePaginate(releases, 50)

  return (
    <>
      {slice.map(([date, albums]) => (
        <ReleaseDay date={date} albums={albums} key={date} />
      ))}
      {next && <Waypoint bottomOffset="-40%" onEnter={next} key={cursor} />}
    </>
  )
}

/**
 * Releases pagination hook
 *
 * @param {ReleasesEntries} releases
 * @param {number} pageSize - Page size threshold
 * @returns {{ cursor: number, slice: ReleasesEntries, next: () => void | null }}
 */
function usePaginate(releases, pageSize) {
  const nextCursor = (currentCursor = 0) => {
    let newCursor = currentCursor
    let pageCount = 0

    for (const [, albums] of releases.slice(currentCursor)) {
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

  return { cursor, slice, next }
}

export default ReleaseList
