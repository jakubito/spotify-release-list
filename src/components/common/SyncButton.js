import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { defer, modalsClosed } from 'helpers'
import { getSyncing, getWorking, getSyncingProgress } from 'state/selectors'
import { sync, syncAnimationFinished } from 'state/actions'
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
  const dispatch = useDispatch()
  const syncingProgress = useSelector(getSyncingProgress)
  const [value, setValue] = useState(0)
  const animating = useRef(false)

  const onTransitionEnd = () => {
    if (value === 100) dispatch(syncAnimationFinished())
    else if (syncingProgress === 100) setValue(100)
    animating.current = false
  }

  useEffect(() => {
    if (animating.current) return
    if (syncingProgress === value) return
    setValue(syncingProgress)
    animating.current = true
  }, [syncingProgress])

  return (
    <span
      className="progress-bar"
      style={{ transform: `translateX(${value - 100}%)` }}
      onTransitionEnd={onTransitionEnd}
    />
  )
}

export default SyncButton
