import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersExcludeVariousArtists } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render Various Artists filter
 */
function VariousArtistsFilter() {
  const dispatch = useDispatch()
  const exclude = useSelector(getFiltersExcludeVariousArtists)

  return (
    <div className="Filters__filter Filters__filter--inline">
      <Checkbox
        id="variousArtistsFilter"
        label="Exclude Various Artists"
        defaultChecked={exclude}
        onChange={(event) =>
          defer(dispatch, setFilters({ excludeVariousArtists: event.target.checked }))
        }
        dark
      />
    </div>
  )
}

export default VariousArtistsFilter
