import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { getSyncing, getWorking, getSyncingProgress } from 'state/selectors'
import { sync } from 'state/actions'
import Button from 'components/Button'

/**
 * Render sync button
 *
 * @param {{ title: string, icon?: string, medium?: boolean }} props
 */
function SyncButton({ title, icon, medium }) {
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const working = useSelector(getWorking)

  const runSync = () => {
    dispatch(sync())
  }

  useHotkeys('r', runSync)

  return (
    <Button
      title={`${title} [R]`}
      className={classNames('SyncButton', { 'is-syncing': syncing })}
      disabled={working}
      onClick={runSync}
      icon={icon}
      medium={medium}
      primary
    >
      <span>{title}</span>
      {syncing && (
        <>
          <Progress />
          <span className="spinner" />
        </>
      )}
    </Button>
  )
}

/**
 * Render progress bar
 */
function Progress() {
  const syncingProgress = useSelector(getSyncingProgress)
  const style = { transform: `translateX(${syncingProgress - 100}%)` }

  return <span className="progress-bar" style={style} />
}

export default SyncButton
