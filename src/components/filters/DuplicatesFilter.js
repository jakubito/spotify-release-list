import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersExcludeDuplicates } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render duplicates filter
 */
function DuplicatesFilter() {
  const dispatch = useDispatch()
  const exclude = useSelector(getFiltersExcludeDuplicates)

  return (
    <Checkbox
      id="duplicatesFilter"
      label="Exclude duplicates"
      defaultChecked={exclude}
      onChange={(event) => defer(dispatch, setFilters({ excludeDuplicates: event.target.checked }))}
      dark
    />
  )
}

export default DuplicatesFilter
