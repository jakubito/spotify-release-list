import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  getSyncing,
  getToken,
  getTokenExpires,
  getTokenScope,
  getWorking,
  getSyncingProgress,
} from 'selectors';
import { generateNonce } from 'helpers';
import { persistor } from 'store';
import { setNonce, sync, setSyncing } from 'actions';
import { startSyncAuthFlow, isValidSyncToken } from 'auth';

function useClickHandler() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);
  const tokenScope = useSelector(getTokenScope);

  const clickHandler = useCallback(async () => {
    if (isValidSyncToken(token, tokenExpires, tokenScope)) {
      dispatch(sync());
    } else {
      const nonce = generateNonce();

      dispatch(setSyncing(true));
      dispatch(setNonce(nonce));

      await persistor.flush();

      startSyncAuthFlow(nonce);
    }
  }, [token, tokenExpires, tokenScope]);

  return clickHandler;
}

function Progress() {
  const syncingProgress = useSelector(getSyncingProgress);
  const style = { width: `${syncingProgress}%` };

  return <span className="Progress" style={style}></span>;
}

function SyncButton({ title, icon = 'fab fa-spotify', className, showProgress = true }) {
  const syncing = useSelector(getSyncing);
  const working = useSelector(getWorking);
  const clickHandler = useClickHandler();

  return (
    <button
      type="button"
      className={classNames(
        'SyncButton',
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
      {showProgress && syncing && <Progress />}
    </button>
  );
}

SyncButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  showProgress: PropTypes.bool,
};

export default SyncButton;
