import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { getCreatingPlaylist, getWorking, getPlaylistId } from 'selectors';
import { resetPlaylist, createPlaylistCancel } from 'actions';

function Actions({ submitTriggered }) {
  const dispatch = useDispatch();
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const working = useSelector(getWorking);
  const playlistId = useSelector(getPlaylistId);
  const { reset } = useFormContext();

  const cancelButtonClickHandler = useCallback(() => {
    reset();
    dispatch(createPlaylistCancel());
  }, [reset]);

  const resetButtonClickHandler = useCallback(() => {
    reset();
    dispatch(resetPlaylist());
  }, [reset]);

  if (creatingPlaylist) {
    return (
      <button
        type="button"
        className="button is-rounded is-dark has-text-weight-semibold"
        onClick={cancelButtonClickHandler}
        key="cancel"
      >
        <span className="icon">
          <i className="fas fa-ban"></i>
        </span>
        <span>Cancel</span>
      </button>
    );
  }

  if (playlistId) {
    return (
      <button
        type="button"
        className="button is-rounded is-dark has-text-weight-semibold"
        onClick={resetButtonClickHandler}
        key="reset"
      >
        <span className="icon">
          <i className="fas fa-undo"></i>
        </span>
        <span>Start over</span>
      </button>
    );
  }

  return (
    <button
      type="submit"
      className={classNames('button is-primary is-rounded has-text-weight-semibold', {
        'is-loading': submitTriggered,
      })}
      disabled={working || submitTriggered}
      key="submit"
    >
      <span className="icon">
        <i className="fas fa-asterisk"></i>
      </span>
      <span>Create</span>
    </button>
  );
}

Actions.propTypes = {
  submitTriggered: PropTypes.bool.isRequired,
};

export default Actions;
