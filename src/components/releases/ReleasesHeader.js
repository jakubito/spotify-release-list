import { useSelector, useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { deferred, modalsClosed } from 'helpers'
import {
  getLastSyncDate,
  getHasReleases,
  getSyncing,
  getFiltersVisible,
  getFiltersApplied,
  getHasOriginalReleases,
  getWorking,
  getEditingFavorites,
} from 'state/selectors'
import {
  showPlaylistModal,
  toggleFiltersVisible,
  resetFilters,
  toggleEditingFavorites,
} from 'state/actions'
import { Header, SyncButton, Button, ButtonLink, LastSync } from 'components/common'

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

  const toggleFilters = deferred(dispatch, toggleFiltersVisible())
  const toggleFavorites = deferred(dispatch, toggleEditingFavorites())
  const openPlaylistModal = deferred(dispatch, showPlaylistModal())

  useHotkeys('e', openPlaylistModal, { enabled: !syncing && lastSyncDate && hasReleases })
  useHotkeys('d', toggleFavorites, { enabled: !syncing && lastSyncDate && hasReleases })
  useHotkeys('f', toggleFilters, {
    enabled: !syncing && lastSyncDate && hasOriginalReleases,
    filter: modalsClosed,
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
                      'far fa-heart': editingFavorites,
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
        {lastSyncDate && hasReleases && !syncing && (
          <Button
            title="Export to playlist [E]"
            icon="fas fa-upload"
            onClick={openPlaylistModal}
            disabled={working}
            compact
          >
            Export
          </Button>
        )}
        <ButtonLink
          to="/settings"
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
