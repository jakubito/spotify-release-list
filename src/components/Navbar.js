import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';
import moment from 'moment';
import { getLastSyncDate, getHasReleases, getSyncing } from 'selectors';
import { showSettingsModal, showPlaylistModal } from 'actions';
import { saveInterval } from 'helpers';
import SyncButton from './SyncButton';
import { useHotkeys } from 'react-hotkeys-hook';

function Navbar() {
  const syncing = useSelector(getSyncing);
  const lastSyncDate = useSelector(getLastSyncDate);
  const hasReleases = useSelector(getHasReleases);
  const dispatch = useDispatch();
  const [lastSyncHuman, setLastSyncHuman] = useState(moment(lastSyncDate).fromNow());

  const playlistModalTrigger = useCallback(() => {
    if (lastSyncDate && hasReleases && !syncing) {
      dispatch(showPlaylistModal());
    }
  }, [lastSyncDate, hasReleases, syncing]);

  const settingsModalTrigger = useCallback(() => {
    if (!syncing) {
      dispatch(showSettingsModal());
    }
  }, [syncing]);

  useHotkeys('n', playlistModalTrigger, {}, [playlistModalTrigger]);
  useHotkeys('s', settingsModalTrigger, {}, [settingsModalTrigger]);

  useEffect(() => {
    const updateLastSyncHuman = () => {
      setLastSyncHuman(moment(lastSyncDate).fromNow());
    };

    updateLastSyncHuman();
    saveInterval(updateLastSyncHuman, 60000);
    window.onfocus = updateLastSyncHuman;
  }, [lastSyncDate]);

  return (
    <nav className="Navbar">
      <div className="title is-4 has-text-light">
        Spotify <Media query={{ maxWidth: 375 }}>{(matches) => matches && <br />}</Media>
        Release List
      </div>
      {lastSyncDate && (
        <div className="sync">
          <SyncButton title="Refresh" icon="fas fa-sync" />
          <div className="last-update has-text-grey">Updated {lastSyncHuman}</div>
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
              <i className="fas fa-plus"></i>
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
            <i className="fas fa-cog"></i>
          </span>
          <Media query={{ minWidth: 769 }}>{(matches) => matches && <span>Settings</span>}</Media>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
