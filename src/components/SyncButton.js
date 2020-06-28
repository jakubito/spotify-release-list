import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames';
import { getSyncing, getWorking, getSyncingProgress } from 'selectors';
import { useSync } from 'hooks';

function Progress() {
  const syncingProgress = useSelector(getSyncingProgress);
  const style = { transform: `translateX(${syncingProgress - 100}%) translateX(-1px)` };

  return <span className="Progress" style={style}></span>;
}

function SyncButton({ title, icon = 'fab fa-spotify', className, showProgress = true }) {
  const syncing = useSelector(getSyncing);
  const working = useSelector(getWorking);
  const syncTrigger = useSync();

  useHotkeys('r', syncTrigger);

  return (
    <button
      title={`${title} [R]`}
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
      onClick={syncTrigger}
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
