import React from 'react';
import { useSelector } from 'react-redux';
import { getSyncing, getLastSync } from 'selectors';
import Loading from './Loading';
import Releases from './Releases';
import SyncButton from './SyncButton';

function Content() {
  const syncing = useSelector(getSyncing);
  const lastSync = useSelector(getLastSync);

  if (!lastSync) {
    return (
      <div className="Content">
        <div className="center has-background-black has-text-weight-semibold">
          <p className="has-text-light is-size-5 has-text-centered intro">
            Display list of Spotify releases from artists you follow.
          </p>
          <SyncButton title="Log in with Spotify" className="is-medium" />
          <a
            href="https://github.com/jakubito/spotify-release-list/blob/master/PRIVACY.md"
            className="has-text-grey-light privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    );
  }

  return <div className="Content">{syncing ? <Loading /> : <Releases />}</div>;
}

export default Content;
