import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deferred } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersExcludeRemixes } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render Various Artists filter
 */
function RemixesFilter() {
  const dispatch = useDispatch()
  const exclude = useSelector(getFiltersExcludeRemixes)
  const [checked, setChecked] = useState(exclude)

  useEffect(deferred(dispatch, setFilters({ excludeRemixes: checked })), [checked])
  useEffect(() => setChecked(exclude), [exclude])

  return (
    <div className="Filters__filter Filters__filter--inline">
      <Checkbox
        id="RemixesFilter"
        label="Exclude Remixes"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        dark
      />
    </div>
  )
}

export default RemixesFilter
