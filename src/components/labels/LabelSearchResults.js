import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import orderBy from 'lodash/orderBy'
import { 
  getLabelSearchResults, 
  getLabelFilters,
  getLabelSelectedReleases 
} from 'state/selectors'
import { toggleLabelRelease } from 'state/actions'
import { Checkbox } from 'components/common'
import LabelAlbum from './LabelAlbum'

/**
 * Display filtered and sorted search results
 */
function LabelSearchResults() {
  const dispatch = useDispatch()
  const searchResults = useSelector(getLabelSearchResults)
  const filters = useSelector(getLabelFilters)
  const selectedReleases = useSelector(getLabelSelectedReleases)

  const filteredAndSortedResults = useMemo(() => {
    if (!searchResults) return []

    let filtered = searchResults

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(album => {
        const releaseYear = new Date(album.release_date).getFullYear()
        return releaseYear === parseInt(filters.year)
      })
    }

    // Sort results
    const sortOrder = filters.sortBy === 'oldest' ? 'asc' : 'desc'
    filtered = orderBy(filtered, ['release_date'], [sortOrder])

    return filtered
  }, [searchResults, filters])

  const handleToggleRelease = (album) => {
    dispatch(toggleLabelRelease(album))
  }

  if (!filteredAndSortedResults.length) {
    return (
      <div className="LabelSearchResults__empty">
        No releases match the current filters.
      </div>
    )
  }

  return (
    <div className="LabelSearchResults">
      <div className="LabelSearchResults__count">
        {filteredAndSortedResults.length} release{filteredAndSortedResults.length !== 1 ? 's' : ''} found
      </div>
      
      <div className="LabelSearchResults__grid">
        {filteredAndSortedResults.map((album) => {
          const isSelected = selectedReleases.some(selected => selected.id === album.id)
          
          return (
            <div key={album.id} className="LabelSearchResults__item">
              <div className="LabelSearchResults__checkbox">
                <Checkbox
                  id={`album-${album.id}`}
                  checked={isSelected}
                  onChange={() => handleToggleRelease(album)}
                  dark
                />
              </div>
              <LabelAlbum album={album} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LabelSearchResults