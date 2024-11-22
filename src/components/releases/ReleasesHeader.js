import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { deferred } from 'helpers'
import {
  getLastSyncDate,
  getHasReleases,
  getSyncing,
  getFiltersVisible,
  getFiltersApplied,
  getHasOriginalReleases,
  getWorking,
  getEditingFavorites,
  getLastSettingsPath,
  getAnyModalVisible,
} from 'state/selectors'
import {
  downloadAlbumsCsv,
  resetFilters,
  showPlaylistModal,
  showUpdatePlaylistModal,
  toggleEditingFavorites,
  toggleFiltersVisible,
} from 'state/actions'
import { Header, SyncButton, Button, ButtonLink, LastSync, Dropdown } from 'components/common'

/**
 * Render main header
 */
function ReleasesHeader() {
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const working = useSelector(getWorking)
  const lastSyncDate = useSelector(getLastSyncDate)
  const hasReleases = useSelector(getHasReleases)
  const hasOriginalReleases = useSelector(getHasOriginalReleases)
  const filtersVisible = useSelector(getFiltersVisible)
  const filtersApplied = useSelector(getFiltersApplied)
  const editingFavorites = useSelector(getEditingFavorites)
  const lastSettingsPath = useSelector(getLastSettingsPath)
  const anyModalVisible = useSelector(getAnyModalVisible)
  const [exportMenuActive, setExportMenuActive] = useState(false)
  const shortcutsEnabled = !anyModalVisible && !syncing && lastSyncDate

  const toggleFilters = deferred(dispatch, toggleFiltersVisible())
  const toggleFavorites = deferred(dispatch, toggleEditingFavorites())

  const openPlaylistModal = deferred(() => {
    dispatch(showPlaylistModal())
    setExportMenuActive(false)
  })

  const openUpdatePlaylistModal = deferred(() => {
    dispatch(showUpdatePlaylistModal())
    setExportMenuActive(false)
  })

  const downloadCsvFile = deferred(() => {
    dispatch(downloadAlbumsCsv())
    setExportMenuActive(false)
  })

  useHotkeys('e', openPlaylistModal, {
    enabled: () => shortcutsEnabled && hasReleases,
  })
  useHotkeys('u', openUpdatePlaylistModal, {
    enabled: () => shortcutsEnabled && hasReleases,
  })
  useHotkeys('c', downloadCsvFile, {
    enabled: () => shortcutsEnabled && hasReleases,
  })
  useHotkeys('d', toggleFavorites, {
    enabled: () => shortcutsEnabled && hasReleases,
  })
  useHotkeys('f', toggleFilters, {
    enabled: () => shortcutsEnabled && hasOriginalReleases,
  })

  return (
    <Header compact={Boolean(lastSyncDate)}>
      {lastSyncDate && (
        <div className="Header__left">
          <SyncButton title="Refresh" icon="fas fa-sync-alt" compact />
          {!syncing && (
            <>
              {hasOriginalReleases && (
                <>
                  <Button
                    title="Edit favorites [D]"
                    icon={classNames({
                      'fas fa-heart': !editingFavorites,
                      'fas fa-minus': editingFavorites,
                    })}
                    onClick={toggleFavorites}
                    disabled={working}
                    dark={editingFavorites}
                    compact
                  >
                    Edit
                  </Button>
                  <Button
                    title="Toggle Filters [F]"
                    icon={classNames('fas', {
                      'fa-search': !filtersVisible,
                      'fa-minus': filtersVisible,
                      'has-text-primary': filtersApplied,
                    })}
                    onClick={toggleFilters}
                    disabled={working}
                    dark={filtersVisible}
                    compact
                  >
                    Filter
                  </Button>
                </>
              )}
              {filtersApplied && (
                <Button
                  title="Reset filters"
                  className="is-hidden-mobile"
                  onClick={deferred(dispatch, resetFilters())}
                  text
                />
              )}
              <LastSync className="is-hidden-touch is-hidden-desktop-only" />
            </>
          )}
        </div>
      )}
      <div className="Header__right">
        <a
          id="ua"
          title="Help Ukraine 🇺🇦"
          href="https://help.gov.ua/en"
          target="_blank"
          rel="noopener noreferrer"
        >
          🇺🇦
        </a>
        {lastSyncDate && hasReleases && !syncing && (
          <Dropdown
            active={exportMenuActive}
            trigger={
              <Button
                title="Export to playlist [E]"
                icon="fas fa-upload"
                onClick={() => setExportMenuActive(!exportMenuActive)}
                disabled={working}
                compact
              >
                Export
              </Button>
            }
            close={() => setExportMenuActive(false)}
            dark
            right
          >
            <Button
              title="Create a new playlist [E]"
              className="dropdown-item"
              onClick={openPlaylistModal}
            >
              Create a new playlist
            </Button>
            <Button
              title="Update an existing playlist [U]"
              className="dropdown-item"
              onClick={openUpdatePlaylistModal}
            >
              Update an existing playlist
            </Button>
            <Button
              title="Export to CSV file [C]"
              className="dropdown-item"
              onClick={downloadCsvFile}
            >
              Export to CSV file
            </Button>
          </Dropdown>
        )}
        <ButtonLink
          to={lastSettingsPath || '/settings'}
          title="Settings [S]"
          icon="fas fa-cog"
          disabled={working}
          compact
        >
          Settings
        </ButtonLink>
      </div>
    </Header>
  )
}

export default ReleasesHeader
