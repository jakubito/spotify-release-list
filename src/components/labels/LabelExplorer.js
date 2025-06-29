import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { 
  searchLabel, 
  clearLabelSearch,
  showLabelPlaylistModal,
  setSelectedLabelReleases,
  toggleAllLabelReleases,
  addFavoriteLabel,
} from 'state/actions'
import {
  getLabelSearchResults,
  getLabelSearching,
  getLabelSelectedReleases,
  getFavoriteLabels,
  getWorking
} from 'state/selectors'
import { deferred, modalsClosed } from 'helpers'
import { VerticalLayout, Content, Header, Button, ButtonLink, Input } from 'components/common'
import LabelSearchResults from './LabelSearchResults'
import LabelFilters from './LabelFilters'
import FavoriteLabels from './FavoriteLabels'
import { LabelPlaylistModalContainer } from 'components/modals'

/**
 * Label Explorer main component
 */
function LabelExplorer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const working = useSelector(getWorking)
  const searchResults = useSelector(getLabelSearchResults)
  const searching = useSelector(getLabelSearching)
  const selectedReleases = useSelector(getLabelSelectedReleases)
  const favoriteLabels = useSelector(getFavoriteLabels)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLabel, setCurrentLabel] = useState('')

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(searchLabel(query.trim()))
        setCurrentLabel(query.trim())
      } else {
        dispatch(clearLabelSearch())
        setCurrentLabel('')
      }
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  useHotkeys('esc', deferred(navigate, '/'), {
    enabled: modalsClosed,
    enableOnFormTags: ['input', 'select'],
  })

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleLabelSelect = (labelName) => {
    setSearchQuery(labelName)
    setCurrentLabel(labelName)
    dispatch(searchLabel(labelName))
  }

  const handleCreatePlaylist = () => {
    if (selectedReleases.length > 0) {
      dispatch(showLabelPlaylistModal())
    }
  }

  const handleSelectAll = () => {
    dispatch(toggleAllLabelReleases())
  }

  const handleClearSelection = () => {
    dispatch(setSelectedLabelReleases([]))
  }

  const handleAddToFavorites = () => {
    if (currentLabel && !favoriteLabels.includes(currentLabel)) {
      dispatch(addFavoriteLabel(currentLabel))
    }
  }

  const selectedCount = selectedReleases.length
  const hasResults = searchResults && searchResults.length > 0

  return (
    <VerticalLayout className="LabelExplorer">
      <Header title="Label Explorer">
        <ButtonLink
          to="/"
          title="Back to Releases"
          icon="fas fa-arrow-left"
          disabled={working}
        />
      </Header>

      <Content>
        <div className="LabelExplorer__container">
          <div className="LabelExplorer__search-section">
            <div className="LabelExplorer__search-bar">
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for a record label..."
                className="LabelExplorer__search-input"
                disabled={searching}
              />
              {currentLabel && (
                <Button
                  title="Add to Favorites"
                  icon="fas fa-heart"
                  onClick={handleAddToFavorites}
                  disabled={favoriteLabels.includes(currentLabel)}
                  className="LabelExplorer__favorite-btn"
                  small
                />
              )}
            </div>

            <FavoriteLabels onLabelSelect={handleLabelSelect} />
          </div>

          {hasResults && (
            <>
              <div className="LabelExplorer__controls">
                <div className="LabelExplorer__selection-controls">
                  <span className="LabelExplorer__selection-count">
                    {selectedCount > 0 && `${selectedCount} selected`}
                  </span>
                  <div className="LabelExplorer__selection-buttons">
                    <Button
                      title="Select All"
                      onClick={handleSelectAll}
                      text
                      small
                    />
                    {selectedCount > 0 && (
                      <Button
                        title="Clear Selection"
                        onClick={handleClearSelection}
                        text
                        small
                      />
                    )}
                  </div>
                </div>

                {selectedCount > 0 && (
                  <Button
                    title={`Create Playlist (${selectedCount} releases)`}
                    icon="fas fa-plus"
                    onClick={handleCreatePlaylist}
                    primary
                    small
                  />
                )}
              </div>

              <LabelFilters />
              <LabelSearchResults />
            </>
          )}

          {searching && (
            <div className="LabelExplorer__loading">
              <span className="icon">
                <i className="fas fa-spinner fa-spin" />
              </span>
              Searching for releases...
            </div>
          )}

          {!searching && !hasResults && searchQuery && (
            <div className="LabelExplorer__no-results">
              No releases found for "{searchQuery}"
            </div>
          )}

          {!searchQuery && (
            <div className="LabelExplorer__welcome">
              <h3>Explore Record Labels</h3>
              <p>Search for any record label to discover their releases, filter by year, and create playlists.</p>
            </div>
          )}
        </div>
      </Content>

      <LabelPlaylistModalContainer />
    </VerticalLayout>
  )
}

export default LabelExplorer