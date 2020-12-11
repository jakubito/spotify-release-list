import { useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { Centered } from 'components/common'
import ReleaseDay from './ReleaseDay'

/**
 * Days limit increment
 */
const DAYS_INCREMENT = 15

/**
 * Lazily render releases sorted by date
 *
 * @param {{ releases: ReleasesEntries }} props
 */
function Releases({ releases }) {
  const [daysLimit, setDaysLimit] = useState(DAYS_INCREMENT)

  if (!releases.length) {
    return <Centered>No albums to display</Centered>
  }

  return (
    <>
      {releases.slice(0, daysLimit).map(([date, albums]) => (
        <ReleaseDay date={date} albums={albums} key={date} />
      ))}
      {daysLimit < releases.length && (
        <Waypoint
          bottomOffset="-100%"
          onEnter={() => setDaysLimit((limit) => limit + DAYS_INCREMENT)}
          key={daysLimit}
        />
      )}
    </>
  )
}

export default Releases
