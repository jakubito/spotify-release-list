import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { sync } from '../actions';
import { getSyncing } from '../selectors';

function SpotifySyncButton({ title, icon, className }) {
  const syncing = useSelector(getSyncing);
  const dispatch = useDispatch();

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
      onClick={() => dispatch(sync())}
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
