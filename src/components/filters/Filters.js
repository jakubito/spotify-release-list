import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deferred } from 'helpers'
import { resetFilters, toggleFiltersVisible } from 'state/actions'
import { getFiltersApplied, getFiltersVisible } from 'state/selectors'
import { Button } from 'components/common'
import AlbumGroupsFilter from './AlbumGroupsFilter'
import DateRangeFilter from './DateRangeFilter'
import SearchFilter from './SearchFilter'
import VariousArtistsFilter from './VariousArtistsFilter'
import DuplicatesFilter from './DuplicatesFilter'

/**
 * Render filters
 */
function Filters() {
  const dispatch = useDispatch()
  const filtersApplied = useSelector(getFiltersApplied)
  const visible = useSelector(getFiltersVisible)

  useEffect(() => {
    if (!filtersApplied && visible) {
      dispatch(toggleFiltersVisible())
    }
  }, [])

  if (!visible) return null

  return (
    <div className="Filters fade-in">
      <SearchFilter />
      <DateRangeFilter />
      <AlbumGroupsFilter />
      <VariousArtistsFilter />
      <DuplicatesFilter />
      {filtersApplied && (
        <div className="Filters__filter is-hidden-tablet">
          <Button title="Reset all filters" onClick={deferred(dispatch, resetFilters())} text />
        </div>
      )}
    </div>
  )
}

export default Filters
