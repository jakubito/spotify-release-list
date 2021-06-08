import { useSelector, useDispatch } from 'react-redux'
import Media from 'react-media'
import { useHotkeys } from 'react-hotkeys-hook'
import classNames from 'classnames'
import { deferred } from 'helpers'
import { useFeature } from 'hooks'
import {
  getLastSyncDate,
  getHasReleases,
  getSyncing,
  getFiltersVisible,
  getFiltersApplied,
  getHasOriginalReleases,
  getWorking,
} from 'state/selectors'
import { showPlaylistModal, toggleFiltersVisible, resetFilters } from 'state/actions'
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
  const { seen: settingsSeen } = useFeature('new-settings-1.8.0')

  const toggleFilters = deferred(dispatch, toggleFiltersVisible())
  const openPlaylistModal = deferred(dispatch, showPlaylistModal())

  useHotkeys('f', toggleFilters)
  useHotkeys('e', openPlaylistModal)

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
          <Button
            title="Export to playlist [E]"
            icon="fas fa-upload"
            onClick={openPlaylistModal}
            disabled={working}
          >
            <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Export</span>}</Media>
          </Button>
        )}
        <ButtonLink
          to="/settings"
          title="Settings [S]"
          icon="fas fa-cog"
          disabled={working}
          className="has-badge"
        >
          <div
            className={classNames('badge is-primary has-text-weight-semibold', {
              'is-hidden': settingsSeen,
            })}
          >
            NEW
          </div>
          <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Settings</span>}</Media>
        </ButtonLink>
      </div>
    </Header>
  )
}

export default ReleasesHeader
