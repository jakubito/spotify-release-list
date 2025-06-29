import { useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FixedSizeList as List } from 'react-window'
import debounce from 'lodash/debounce'
import {
  getFollowedArtists,
  getUnfollowingArtists,
  getWorking,
} from 'state/selectors'
import {
  unfollowArtists,
} from 'state/actions'
import { Button, Input, Checkbox } from 'components/common'

/**
 * Render followed artists manager
 */
function FollowedArtistsManager() {
  const dispatch = useDispatch()
  const followedArtists = useSelector(getFollowedArtists)
  const unfollowingArtists = useSelector(getUnfollowingArtists)
  const working = useSelector(getWorking)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedArtists, setSelectedArtists] = useState(new Set())

  // Debounced search to avoid excessive filtering
  const debouncedSetSearchQuery = useCallback(
    debounce((query) => setSearchQuery(query), 300),
    []
  )

  // Filter and sort artists
  const filteredAndSortedArtists = useMemo(() => {
    let filtered = followedArtists

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [followedArtists, searchQuery, sortOrder])

  const handleSearchChange = (event) => {
    debouncedSetSearchQuery(event.target.value)
  }

  const handleSelectArtist = (artistId, selected) => {
    const newSelected = new Set(selectedArtists)
    if (selected) {
      newSelected.add(artistId)
    } else {
      newSelected.delete(artistId)
    }
    setSelectedArtists(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedArtists.size === filteredAndSortedArtists.length) {
      setSelectedArtists(new Set())
    } else {
      setSelectedArtists(new Set(filteredAndSortedArtists.map((artist) => artist.id)))
    }
  }

  const handleUnfollowSelected = () => {
    if (selectedArtists.size > 0) {
      dispatch(unfollowArtists(Array.from(selectedArtists)))
      setSelectedArtists(new Set())
    }
  }

  const selectedCount = selectedArtists.size
  const allSelected = selectedCount === filteredAndSortedArtists.length && selectedCount > 0

  return (
    <div className="FollowedArtistsManager fade-in">
      <div className="FollowedArtistsManager__header">
        <div className="FollowedArtistsManager__search">
          <Input
            placeholder="Search artists..."
            onChange={handleSearchChange}
            className="FollowedArtistsManager__search-input"
          />
        </div>

        <div className="FollowedArtistsManager__controls">
          <div className="FollowedArtistsManager__filters">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="FollowedArtistsManager__select"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          <div className="FollowedArtistsManager__selection">
            <Checkbox
              id="selectAll"
              label={`Select All (${filteredAndSortedArtists.length})`}
              checked={allSelected}
              onChange={handleSelectAll}
              disabled={filteredAndSortedArtists.length === 0}
              dark
            />
          </div>
        </div>
      </div>

      <div className="FollowedArtistsManager__stats">
        <span>
          Showing {filteredAndSortedArtists.length} of {followedArtists.length} artists
        </span>
        {selectedCount > 0 && <span> • {selectedCount} selected</span>}
      </div>

      {selectedCount > 0 && (
        <div className="FollowedArtistsManager__actions">
          <Button
            title={`Unfollow ${selectedCount} artist${selectedCount > 1 ? 's' : ''}`}
            icon="fas fa-user-minus"
            onClick={handleUnfollowSelected}
            disabled={working}
            danger
            small
          >
            Unfollow Selected
          </Button>
        </div>
      )}

      <div className="FollowedArtistsManager__list">
        {filteredAndSortedArtists.length > 0 ? (
          <List
            height={400}
            itemCount={filteredAndSortedArtists.length}
            itemSize={60}
            itemData={{
              artists: filteredAndSortedArtists,
              selectedArtists,
              onSelectArtist: handleSelectArtist,
            }}
          >
            {ArtistRow}
          </List>
        ) : (
          <div className="FollowedArtistsManager__empty">
            {searchQuery
              ? 'No artists match your search'
              : 'No followed artists found'}
          </div>
        )}
      </div>

      {unfollowingArtists && (
        <div className="FollowedArtistsManager__loading">
          <span className="icon">
            <i className="fas fa-spinner fa-spin" />
          </span>
          Unfollowing artists...
        </div>
      )}
    </div>
  )
}

/**
 * Individual artist row component for virtualized list
 */
function ArtistRow({ index, style, data }) {
  const { artists, selectedArtists, onSelectArtist } = data
  const artist = artists[index]
  const isSelected = selectedArtists.has(artist.id)

  return (
    <div style={style} className="FollowedArtistsManager__row">
      <div className="FollowedArtistsManager__row-content">
        <Checkbox
          id={`artist-${artist.id}`}
          checked={isSelected}
          onChange={(e) => onSelectArtist(artist.id, e.target.checked)}
          dark
        />
        <div className="FollowedArtistsManager__artist-info">
          <span className="FollowedArtistsManager__artist-name">{artist.name}</span>
        </div>
      </div>
    </div>
  )
}

export default FollowedArtistsManager