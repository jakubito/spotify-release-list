import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFiltersVisible } from 'state/actions'
import { getFiltersApplied, getFiltersVisible } from 'state/selectors'
import AlbumGroupsFilter from './AlbumGroupsFilter'
import DateRangeFilter from './DateRangeFilter'
import SearchFilter from './SearchFilter'

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

  if (!visible) {
    return null
  }

  return (
    <div className="Filters fade-in">
      <SearchFilter />
      <DateRangeFilter />
      <AlbumGroupsFilter />
    </div>
  )
}

export default Filters
