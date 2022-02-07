import { useState } from 'react'
import classNames from 'classnames'
import { Button, Dropdown } from 'components/common'
import { useDispatch, useSelector } from 'react-redux'
import { applyLabelBlocklist, setFilters, setSettings } from 'state/actions'
import { getSettings } from 'state/selectors'
import { deferred } from 'helpers'

/**
 * Render label dropdown
 *
 * @param {{ label: string }} props
 */
function LabelDropdown({ label }) {
  const settings = useSelector(getSettings)
  const dispatch = useDispatch()
  const [active, setActive] = useState(false)

  const block = () => {
    const labelBlocklist = settings.labelBlocklist.trim().concat(`\n${label}`)
    dispatch(setSettings({ labelBlocklist }))
    dispatch(applyLabelBlocklist())
  }

  const trigger = (
    <button
      onClick={() => setActive(!active)}
      className={classNames('Album__meta LabelDropdown__trigger', {
        'LabelDropdown__trigger--active': active,
      })}
    >
      {label}
      <i
        className={classNames('LabelDropdown__trigger-icon fas', {
          'LabelDropdown__trigger-icon--active': active,
          'fa-angle-up': active,
          'fa-angle-down': !active,
        })}
      />
    </button>
  )

  return (
    <Dropdown active={active} trigger={trigger} close={() => setActive(false)} dark>
      <Button
        titleOnly="Filter by this label"
        icon="fas fa-filter"
        className="dropdown-item"
        onClick={deferred(dispatch, setFilters({ search: label }))}
      >
        Filter by this label
      </Button>
      <Button
        titleOnly="Add this label to blocklist"
        icon="fas fa-ban"
        className="dropdown-item"
        onClick={deferred(block)}
      >
        Block this label
      </Button>
    </Dropdown>
  )
}

export default LabelDropdown
