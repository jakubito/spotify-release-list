import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deferred } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersExcludeVariousArtists } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render Various Artists filter
 */
function VariousArtistsFilter() {
  const dispatch = useDispatch()
  const exclude = useSelector(getFiltersExcludeVariousArtists)
  const [checked, setChecked] = useState(exclude)

  useEffect(deferred(dispatch, setFilters({ excludeVariousArtists: checked })), [checked])
  useEffect(() => setChecked(exclude), [exclude])

  return (
    <div className="Filters__filter Filters__filter--inline">
      <Checkbox
        id="variousArtistsFilter"
        label="Exclude Various Artists"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        dark
      />
    </div>
  )
}

export default VariousArtistsFilter
