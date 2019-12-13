import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideSettingsModal, showResetModal } from '../../actions';
import { useModal } from '../../hooks';
import { getUser } from '../../selectors';
import AlbumGroupsField from '../settings/AlbumGroupsField';
import TimePeriodField from '../settings/TimePeriodField';
import MarketField from '../settings/MarketField';
import UriLinksField from '../settings/UriLinksField';

function SettingsModal() {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const closeModal = useModal(hideSettingsModal);

  return (
    <div className="SettingsModal modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content has-background-black-bis has-text-light">
        <h4 className="title is-4 has-text-light has-text-centered">Settings</h4>

        <AlbumGroupsField />
        <TimePeriodField />
        <MarketField />
        <UriLinksField />

        <p className="help">Note: Please refresh the album list to apply these settings.</p>

        <div className="actions columns is-gapless">
          <div className="column">
            <button
              className="button is-primary is-rounded has-text-weight-semibold"
              onClick={closeModal}
            >
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
              <span>All good</span>
            </button>
          </div>

          {user && (
            <div className="column has-text-right">
              <button
                className="button is-danger is-rounded has-text-weight-semibold"
                onClick={() => dispatch(showResetModal())}
              >
                <span className="icon">
                  <i className="fas fa-trash-alt"></i>
                </span>
                <span>Delete all data</span>
              </button>
            </div>
          )}
        </div>

        <div className="credits has-text-centered has-text-grey">
          Made with{' '}
          <span role="img" aria-label="heart emoji">
            💛
          </span>{' '}
          by{' '}
          <a
            href="https://github.com/jakubito"
            className="has-text-grey-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jakub Dobes
          </a>{' '}
          •{' '}
          <a
            href="https://github.com/jakubito/spotify-release-list-web"
            className="has-text-grey-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
