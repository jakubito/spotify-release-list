import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Media from 'react-media'
import { useHotkeys } from 'react-hotkeys-hook'
import moment from 'moment'
import { getLastSyncDate, getHasReleases, getSyncing } from 'state/selectors'
import { showSettingsModal, showPlaylistModal } from 'state/actions'
import SyncButton from '../SyncButton'
import { useLastSyncUpdater } from './hooks'

/**
 * Render header
 */
function Header() {
  const syncing = useSelector(getSyncing)
  const lastSyncDate = useSelector(getLastSyncDate)
  const hasReleases = useSelector(getHasReleases)
  const dispatch = useDispatch()
  const [lastSyncHuman, setLastSyncHuman] = useState(moment(lastSyncDate).fromNow())

  const playlistModalTrigger = useCallback(() => {
    if (lastSyncDate && hasReleases && !syncing) {
      dispatch(showPlaylistModal())
    }
  }, [lastSyncDate, hasReleases, syncing])

  const settingsModalTrigger = useCallback(() => {
    if (!syncing) {
      dispatch(showSettingsModal())
    }
  }, [syncing])

  useHotkeys('n', playlistModalTrigger, {}, [playlistModalTrigger])
  useHotkeys('e', settingsModalTrigger, {}, [settingsModalTrigger])

  useLastSyncUpdater(setLastSyncHuman)

  return (
    <nav className="Navbar">
      <div className="title is-4 has-text-light">
        Spotify <Media query={{ maxWidth: 375 }}>{(matches) => matches && <br />}</Media>
        Release List
      </div>
      {lastSyncDate && (
        <div className="sync">
          <SyncButton title="Refresh" icon="fas fa-sync" />
          {!syncing && <div className="last-update has-text-grey">Updated {lastSyncHuman}</div>}
        </div>
      )}
      <div className="right">
        {lastSyncDate && hasReleases && !syncing && (
          <button
            title="Export to a new playlist [E]"
            className="button is-rounded is-dark has-text-weight-semibold"
            onClick={playlistModalTrigger}
          >
            <span className="icon">
              <i className="fas fa-arrow-up" />
            </span>
            <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Export</span>}</Media>
          </button>
        )}

        <button
          title="Settings [S]"
          className="button is-rounded is-dark has-text-weight-semibold"
          onClick={settingsModalTrigger}
          disabled={syncing}
        >
          <span className="icon">
            <i className="fas fa-cog" />
          </span>
          <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Settings</span>}</Media>
        </button>
      </div>
    </nav>
  )
}

export default Header
