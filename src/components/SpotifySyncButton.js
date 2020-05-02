import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { getSyncing, getToken, getTokenExpires, getTokenScope, getWorking } from '../selectors';
import { generateNonce } from '../helpers';
import { persistor } from '../store';
import { setNonce, sync, setSyncing } from '../actions';
import { startSyncAuthFlow, isValidSyncToken } from '../auth';

function useClickHandler() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);
  const tokenScope = useSelector(getTokenScope);

  return useCallback(
    async (event) => {
      event.preventDefault();

      if (isValidSyncToken(token, tokenExpires, tokenScope)) {
        dispatch(sync());
      } else {
        const nonce = generateNonce();

        dispatch(setSyncing(true));
        dispatch(setNonce(nonce));

        await persistor.flush();

        startSyncAuthFlow(nonce);
      }
    },
    [token, tokenExpires, tokenScope]
  );
}

function SpotifySyncButton({ title, icon, className }) {
  const syncing = useSelector(getSyncing);
  const working = useSelector(getWorking);
  const clickHandler = useClickHandler();

  return (
    <button
      className={classNames(
        'SpotifySyncButton',
        'button',
        'is-primary',
        'is-rounded',
        'has-text-weight-semibold',
        { 'is-loading': syncing },
        className
      )}
      disabled={working}
      onClick={clickHandler}
    >
      <span className="icon">
        <i className={icon}></i>
      </span>
      <span>{title}</span>
    </button>
  );
}

SpotifySyncButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
};

SpotifySyncButton.defaultProps = {
  icon: 'fab fa-spotify',
};

export default SpotifySyncButton;
