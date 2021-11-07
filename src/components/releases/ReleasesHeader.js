import { useSelector, useDispatch } from 'react-redux'
import Media from 'react-media'
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
    <Header>
      {lastSyncDate && (
        <div className="left">
          <SyncButton title="Refresh" icon="fas fa-sync-alt" />
          {!syncing && (
            <>
              {hasOriginalReleases && (
                <Button
                  title="Toggle Filters [F]"
                  icon={classNames('fas', {
                    'fa-search': !filtersVisible,
                    'fa-minus': filtersVisible,
                  })}
                  onClick={toggleFilters}
                  disabled={working}
                  dark={filtersVisible}
                >
                  Filter
                </Button>
              )}
              {filtersApplied && (
                <Button title="Reset filters" onClick={deferred(dispatch, resetFilters())} text />
              )}
              <LastSync className="is-hidden-mobile" />
            </>
          )}
        </div>
      )}
      <div className="right">
        {lastSyncDate && hasReleases && !syncing && (
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
            >
              <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Edit</span>}</Media>
            </Button>
            <Button
              title="Export to playlist [E]"
              icon="fas fa-upload"
              onClick={openPlaylistModal}
              disabled={working}
            >
              <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Export</span>}</Media>
            </Button>
          </>
        )}
        <ButtonLink to="/settings" title="Settings [S]" icon="fas fa-cog" disabled={working}>
          <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Settings</span>}</Media>
        </ButtonLink>
      </div>
    </Header>
  )
}

export default ReleasesHeader
