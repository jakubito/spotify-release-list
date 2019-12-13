import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';
import { getLastSyncDate, getUser, getSyncedOnce } from '../selectors';
import { showSettingsModal } from '../actions';
import { getLastSyncHuman } from '../helpers';
import SpotifySyncButton from './SpotifySyncButton';
import Profile from './Profile';

function Navbar() {
  const syncedOnce = useSelector(getSyncedOnce);
  const lastSyncDate = useSelector(getLastSyncDate);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const [lastSyncHuman, setLastSyncHuman] = useState(getLastSyncHuman(lastSyncDate));

  useEffect(() => {
    const updateLastSyncHuman = () => {
      setLastSyncHuman(getLastSyncHuman(lastSyncDate));
    };

    window.onfocus = updateLastSyncHuman;
    updateLastSyncHuman();
  }, [lastSyncDate, setLastSyncHuman]);

  return (
    <nav className="Navbar">
      <div className="title is-4 has-text-light">Spotify Release List</div>
      {syncedOnce && (
        <div className="sync">
          <SpotifySyncButton title="Refresh" icon="fas fa-sync" />
          <div className="last-update has-text-grey">Last update: {lastSyncHuman}</div>
        </div>
      )}
      <div className="right">
        {user && <Profile name={user.name} image={user.image} className="is-hidden-mobile" />}
        <button
          className="button is-rounded is-dark has-text-weight-semibold"
          onClick={() => dispatch(showSettingsModal())}
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
