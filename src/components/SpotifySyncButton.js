import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setNonce } from '../actions';
import { getSyncing } from '../selectors';
import { authorize } from '../oauth';
import { generateNonce } from '../helpers';

function SpotifySyncButton({ title, icon, className }) {
  const syncing = useSelector(getSyncing);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    const nonce = generateNonce();

    dispatch(setNonce(nonce));
    authorize(nonce);
  }, [dispatch]);

  return (
    <button
      className={classNames(
        'SpotifySyncButton',
        'button',
        'is-primary',
        'is-rounded',
        'has-text-weight-semibold',
        {
          'is-loading': syncing,
        },
        className
      )}
      disabled={syncing}
      onClick={onClick}
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
