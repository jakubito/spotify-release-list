import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { Waypoint } from 'react-waypoint'
import { FieldName } from 'enums'
import { toggleSetValue, defer } from 'helpers'
import Button from 'components/Button'
import AlbumFullTitle from './AlbumFullTitle'

const { RELEASES, SELECTED_RELEASES } = FieldName
const LIMIT_INCREMENT = 50

/**
 * Lazily render playlist album selection list
 */
function SelectionEntries() {
  const { setValue, watch } = useFormContext()
  const [limit, setLimit] = useState(LIMIT_INCREMENT)
  const [animate, setAnimate] = useState(false)
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const container = useRef(null)
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const inner = useRef(null)

  /** @type {string[]} */
  const releases = watch(RELEASES)
  /** @type {Set<string>} */
  const selectedReleases = watch(SELECTED_RELEASES)

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChangeHandler = (event) => {
    defer(setValue, SELECTED_RELEASES, toggleSetValue(selectedReleases, event.target.value), true)
  }

  useEffect(() => {
    setAnimate(inner.current?.scrollHeight > container.current?.clientHeight)
  }, [releases])

  return (
    <div className="selection">
      <Button
        title="Select all"
        onClick={() => defer(setValue, SELECTED_RELEASES, new Set(releases), true)}
        darker
        small
      >
        Select all
      </Button>
      <Button
        title="Unselect all"
        onClick={() => defer(setValue, SELECTED_RELEASES, new Set([]), true)}
        darker
        small
      >
        Unselect all
      </Button>

      <div className="container" ref={container}>
        <div className={classNames('inner', { animate })} ref={inner}>
          {releases.slice(0, limit).map((releaseId) => (
            <ReleaseField
              releaseId={releaseId}
              selectedReleases={selectedReleases}
              onChange={onChangeHandler}
              key={releaseId}
            />
          ))}
          {limit < releases.length && (
            <Waypoint
              bottomOffset="-100%"
              onEnter={() => setLimit((limit) => limit + LIMIT_INCREMENT)}
              key={limit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{
 *   releaseId: string
 *   selectedReleases: Set<string>
 *   onChange: React.ChangeEventHandler<HTMLInputElement>
 * }} props
 */
function ReleaseField({ releaseId, selectedReleases, onChange }) {
  return (
    <div className="field" key={releaseId}>
      <input
        type="checkbox"
        className={classNames('is-checkradio is-small is-white', {
          'has-background-color': selectedReleases.has(releaseId),
        })}
        id={`selectedReleases[${releaseId}]`}
        name={`selectedReleases[${releaseId}]`}
        value={releaseId}
        checked={selectedReleases.has(releaseId)}
        onChange={onChange}
      />
      <label
        htmlFor={`selectedReleases[${releaseId}]`}
        className={classNames('is-unselectable', {
          'has-text-grey': !selectedReleases.has(releaseId),
        })}
      >
        <AlbumFullTitle id={releaseId} />
      </label>
    </div>
  )
}

export default SelectionEntries
