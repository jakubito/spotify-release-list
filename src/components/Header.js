import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Media from 'react-media'
import { useHotkeys } from 'react-hotkeys-hook'
import moment from 'moment'
import { getLastSyncDate, getHasReleases, getSyncing } from 'selectors'
import { showSettingsModal, showPlaylistModal } from 'actions'
import SyncButton from './SyncButton'

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
  useHotkeys('s', settingsModalTrigger, {}, [settingsModalTrigger])

  useLastSyncUpdater(lastSyncDate, setLastSyncHuman)

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
            title="New playlist [N]"
            className="button is-rounded is-dark has-text-weight-semibold"
            onClick={playlistModalTrigger}
          >
            <span className="icon">
              <i className="fas fa-plus" />
            </span>
            <Media query={{ minWidth: 769 }}>
              {(matches) => matches && <span>New playlist</span>}
            </Media>
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

/**
 * @param {Date} lastSyncDate
 * @param {(text: string) => any} setLastSyncHuman
 */
function useLastSyncUpdater(lastSyncDate, setLastSyncHuman) {
  useEffect(() => {
    const updateLastSyncHuman = () => {
      setLastSyncHuman(moment(lastSyncDate).fromNow())
    }

    const intervalId = setInterval(updateLastSyncHuman, 60 * 1000)
    window.addEventListener('focus', updateLastSyncHuman)
    updateLastSyncHuman()

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', updateLastSyncHuman)
    }
  }, [lastSyncDate])
}

export default Header
