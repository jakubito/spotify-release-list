import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Media from 'react-media'
import { useHotkeys } from 'react-hotkeys-hook'
import moment from 'moment'
import classNames from 'classnames'
import { defer } from 'helpers'
import {
  getLastSyncDate,
  getHasReleases,
  getSyncing,
  getFiltersVisible,
  getFiltersApplied,
} from 'state/selectors'
import {
  showSettingsModal,
  showPlaylistModal,
  toggleFiltersVisible,
  resetFilters,
} from 'state/actions'
import SyncButton from 'components/SyncButton'
import Button from 'components/Button'

/**
 * Render header
 */
function Header() {
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const lastSyncDate = useSelector(getLastSyncDate)
  const hasReleases = useSelector(getHasReleases)
  const filtersVisible = useSelector(getFiltersVisible)
  const filtersApplied = useSelector(getFiltersApplied)
  const lastSync = useLastSync(lastSyncDate)

  const toggleFilters = () => defer(dispatch, toggleFiltersVisible())
  const openPlaylistModal = () => defer(dispatch, showPlaylistModal())
  const openSettingsModal = () => defer(dispatch, showSettingsModal())

  useHotkeys('f', toggleFilters)
  useHotkeys('e', openPlaylistModal)
  useHotkeys('s', openSettingsModal)

  return (
    <nav className="Header">
      <div className="title is-4 has-text-light">
        Spotify <Media query={{ maxWidth: 375 }}>{(matches) => matches && <br />}</Media>
        Release List
      </div>
      {lastSyncDate && (
        <div className="left">
          <SyncButton title="Refresh" icon="fas fa-sync-alt" />
          {!syncing && (
            <>
              <Button
                title="Toggle Filters [F]"
                icon={classNames('fas', {
                  'fa-search': !filtersVisible,
                  'fa-minus': filtersVisible,
                })}
                onClick={toggleFilters}
                dark={filtersVisible}
              >
                Filter
              </Button>
              {filtersApplied && (
                <Button
                  title="Reset filters"
                  onClick={() => defer(dispatch, resetFilters())}
                  text
                />
              )}
              <div className="last-update has-text-grey">Updated {lastSync}</div>
            </>
          )}
        </div>
      )}
      <div className="right">
        {lastSyncDate && hasReleases && !syncing && (
          <Button
            title="Export to a new playlist [E]"
            icon="fas fa-arrow-up"
            onClick={openPlaylistModal}
          >
            <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Export</span>}</Media>
          </Button>
        )}
        <Button
          title="Settings [S]"
          icon="fas fa-cog"
          onClick={openSettingsModal}
          disabled={syncing}
        >
          <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Settings</span>}</Media>
        </Button>
      </div>
    </nav>
  )
}

/**
 * Auto update last sync information every minute and when focused
 *
 * @param {Date} lastSyncDate
 */
export function useLastSync(lastSyncDate) {
  const [lastSync, setLastSync] = useState(moment(lastSyncDate).fromNow())

  useEffect(() => {
    const updateLastSync = () => {
      setLastSync(moment(lastSyncDate).fromNow())
    }

    const intervalId = setInterval(updateLastSync, 60 * 1000)
    window.addEventListener('focus', updateLastSync)
    updateLastSync()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', updateLastSync)
    }
  }, [lastSyncDate])

  return lastSync
}

export default Header
