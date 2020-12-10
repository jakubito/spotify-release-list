import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersVariousArtists } from 'state/selectors'
import { Checkbox } from 'components/common'

/**
 * Render Various Artists filter
 */
function VariousArtistsFilter() {
  const dispatch = useDispatch()
  const variousArtists = useSelector(getFiltersVariousArtists)

  return (
    <Checkbox
      id="covers"
      label="Include Various Artists"
      defaultChecked={variousArtists}
      onChange={(event) => defer(dispatch, setFilters({ variousArtists: event.target.checked }))}
      dark
    />
  )
}

export default VariousArtistsFilter
