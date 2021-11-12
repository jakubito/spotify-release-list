import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deferred } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersExcludeDuplicates } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render duplicates filter
 */
function DuplicatesFilter() {
  const dispatch = useDispatch()
  const exclude = useSelector(getFiltersExcludeDuplicates)
  const [checked, setChecked] = useState(exclude)

  useEffect(deferred(dispatch, setFilters({ excludeDuplicates: checked })), [checked])
  useEffect(() => setChecked(exclude), [exclude])

  return (
    <div className="Filters__filter Filters__filter--inline">
      <Checkbox
        id="duplicatesFilter"
        label="Exclude duplicates"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        dark
      />
    </div>
  )
}

export default DuplicatesFilter
