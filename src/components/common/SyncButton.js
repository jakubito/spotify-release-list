import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { defer, modalsClosed } from 'helpers'
import { getSyncing, getWorking, getSyncingProgress } from 'state/selectors'
import { sync } from 'state/actions'
import { Button } from 'components/common'

/**
 * Render sync button
 *
 * @param {{
 *   title: string
 *   icon?: string
 *   medium?: boolean
 *   compact?: boolean
 * }} props
 */
function SyncButton({ title, icon, medium, compact }) {
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const working = useSelector(getWorking)
  const [disabled, setDisabled] = useState(false)
  const isTablet = useMediaQuery({ minWidth: 769 })
  const displayTitle = !compact || isTablet

  const dispatchSync = () => {
    dispatch(sync())
  }

  const onClick = () => {
    setDisabled(true)
    defer(dispatchSync)
  }

  useHotkeys('r', dispatchSync, { enabled: modalsClosed })
  useEffect(() => setDisabled(working), [working])

  return (
    <Button
      title={`${title} [R]`}
      className={classNames('SyncButton', {
        'SyncButton--syncing': syncing,
        'SyncButton--compact': compact,
      })}
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      medium={medium}
      primary
    >
      {displayTitle && <span>{title}</span>}
      {syncing && (
        <>
          <ProgressBar />
          <span className="spinner" />
        </>
      )}
    </Button>
  )
}

/**
 * Render progress bar
 */
function ProgressBar() {
  const syncingProgress = useSelector(getSyncingProgress)
  const style = { transform: `translateX(${syncingProgress - 100}%)` }

  return <span className="progress-bar" style={style} />
}

export default SyncButton
