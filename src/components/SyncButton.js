import React from 'react'
import { useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { getSyncing, getWorking, getSyncingProgress } from 'selectors'
import { useSync } from 'hooks'

/**
 * Render sync button
 *
 * @param {{ title: string, icon?: string, className?: string, showProgress?: boolean }} props
 */
function SyncButton({ title, icon = 'fab fa-spotify', className, showProgress = true }) {
  const syncing = useSelector(getSyncing)
  const working = useSelector(getWorking)
  const syncTrigger = useSync()

  useHotkeys('r', syncTrigger, {}, [syncTrigger])

  return (
    <button
      title={`${title} [R]`}
      type="button"
      className={classNames(
        'SyncButton',
        'button',
        'is-primary',
        'is-rounded',
        'has-text-weight-semibold',
        { 'is-syncing': syncing },
        className
      )}
      disabled={working}
      onClick={syncTrigger}
    >
      <span className="icon">
        <i className={icon} />
      </span>
      <span>{title}</span>
      {showProgress && syncing && <Progress />}
      {syncing && <span className="spinner" />}
    </button>
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
