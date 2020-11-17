import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'
import { getLastSyncDate } from 'state/selectors'

/**
 * Render last update information
 *
 * @param {{ className?: string }} props
 */
function LastSync({ className }) {
  const lastSyncDate = useSelector(getLastSyncDate)
  const [value, setValue] = useState(moment(lastSyncDate).fromNow())

  useEffect(() => {
    const update = () => {
      setValue(moment(lastSyncDate).fromNow())
    }

    const intervalId = setInterval(update, 1000 * 60)
    window.addEventListener('focus', update)
    update()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', update)
    }
  }, [lastSyncDate])

  return (
    <div className={classNames('LastSync', 'has-text-grey', className)}>
      <span className="icon">
        <i className="fas fa-clock"></i>
      </span>{' '}
      Updated {value}
    </div>
  )
}

export default LastSync
