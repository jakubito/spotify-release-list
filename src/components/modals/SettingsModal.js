import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideSettingsModal, showResetModal } from '../../actions';
import { useModal } from '../../hooks';
import { getUser } from '../../selectors';
import {
  AlbumGroupsField,
  TimePeriodField,
  MarketField,
  UriLinksField,
  CoversField,
} from '../settings';

function SettingsModal() {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const closeModal = useModal(hideSettingsModal);

  return (
    <div className="SettingsModal modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content has-background-black-bis has-text-light">
        <h4 className="title is-4 has-text-light has-text-centered">Settings</h4>

        <div className="columns">
          <div className="column">
            <AlbumGroupsField />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <TimePeriodField />
          </div>
          <div className="column">
            <MarketField />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <UriLinksField />
          </div>
          <div className="column">
            <CoversField />
          </div>
        </div>

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
        </div>

        {user && (
          <div className="reset has-text-grey-light">
            Logged in as {user.name}
            <button
              className="button is-dark is-rounded is-small has-text-weight-semibold"
              onClick={() => dispatch(showResetModal())}
            >
              <span className="icon">
                <i className="far fa-trash-alt"></i>
              </span>
              <span>Delete all data</span>
            </button>
          </div>
        )}

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
            github
          </a>{' '}
          • v1.2.1
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
