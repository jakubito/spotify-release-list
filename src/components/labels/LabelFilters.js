import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { getLabelSearchResults, getLabelFilters } from 'state/selectors'
import { setLabelFilters, resetLabelFilters } from 'state/actions'
import { Select, Button } from 'components/common'

/**
 * Filters for label search results
 */
function LabelFilters() {
  const dispatch = useDispatch()
  const searchResults = useSelector(getLabelSearchResults)
  const filters = useSelector(getLabelFilters)

  // Extract unique years from search results
  const availableYears = useMemo(() => {
    if (!searchResults) return []
    
    const years = searchResults.map(album => {
      return new Date(album.release_date).getFullYear()
    })
    
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a)
    return uniqueYears.map(year => [year.toString(), year.toString()])
  }, [searchResults])

  const sortOptions = [
    ['newest', 'Newest First'],
    ['oldest', 'Oldest First']
  ]

  const handleYearChange = (event) => {
    const year = event.target.value || null
    dispatch(setLabelFilters({ year }))
  }

  const handleSortChange = (event) => {
    dispatch(setLabelFilters({ sortBy: event.target.value }))
  }

  const handleReset = () => {
    dispatch(resetLabelFilters())
  }

  const hasFilters = filters.year || filters.sortBy !== 'newest'

  if (!searchResults || searchResults.length === 0) {
    return null
  }

  return (
    <div className="LabelFilters">
      <div className="LabelFilters__controls">
        <div className="LabelFilters__group">
          <label className="LabelFilters__label">Release Year</label>
          <Select
            value={filters.year || ''}
            onChange={handleYearChange}
            options={[['', 'All Years'], ...availableYears]}
            className="LabelFilters__select"
          />
        </div>

        <div className="LabelFilters__group">
          <label className="LabelFilters__label">Sort By</label>
          <Select
            value={filters.sortBy}
            onChange={handleSortChange}
            options={sortOptions}
            className="LabelFilters__select"
          />
        </div>

        {hasFilters && (
          <Button
            title="Reset Filters"
            onClick={handleReset}
            text
            small
          />
        )}
      </div>
    </div>
  )
}

export default LabelFilters