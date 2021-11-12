import { useSelector } from 'react-redux'
import { getUser } from 'state/selectors'
import { LastSync } from 'components/common'

/**
 * Render last sync and user information
 */
function DataInfo() {
  const user = useSelector(getUser)

  return (
    <div className="DataInfo has-text-grey">
      <LastSync className="DataInfo__item is-hidden-widescreen" />
      <div className="DataInfo__item">
        <span className="icon">
          <i className="fas fa-user-circle"></i>
        </span>{' '}
        Logged in as {user.name}
      </div>
    </div>
  )
}

export default DataInfo
