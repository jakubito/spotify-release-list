import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { defer } from 'helpers'
import { getSyncing, getWorking, getSyncingProgress } from 'state/selectors'
import { sync } from 'state/actions'
import { Button } from 'components/common'

/**
 * Render sync button
 *
 * @param {{ title: string, icon?: string, medium?: boolean }} props
 */
function SyncButton({ title, icon, medium }) {
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const working = useSelector(getWorking)
  const [disabled, setDisabled] = useState(false)

  const onClick = () => {
    setDisabled(true)
    defer(dispatch, sync())
  }

  useHotkeys('r', () => {
    dispatch(sync())
  })

  useEffect(() => setDisabled(working), [working])

  return (
    <Button
      title={`${title} [R]`}
      className={classNames('SyncButton', { 'is-syncing': syncing })}
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      medium={medium}
      primary
    >
      <span>{title}</span>
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
