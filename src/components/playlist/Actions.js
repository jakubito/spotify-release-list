import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { getCreatingPlaylist, getWorking, getPlaylistId } from 'selectors';
import { resetPlaylist } from 'actions';

function Actions() {
  const dispatch = useDispatch();
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const working = useSelector(getWorking);
  const playlistId = useSelector(getPlaylistId);
  const { reset } = useFormContext();

  const resetButtonClickHandler = useCallback(
    (event) => {
      event.preventDefault();
      reset();
      dispatch(resetPlaylist());
    },
    [reset]
  );

  if (playlistId) {
    return (
      <button
        className="button is-rounded is-dark has-text-weight-semibold"
        onClick={resetButtonClickHandler}
      >
        <span className="icon" key="fa-undo">
          <i className="fas fa-undo"></i>
        </span>
        <span>Start over</span>
      </button>
    );
  }

  return (
    <button
      type="submit"
      className={classNames('button', 'is-primary', 'is-rounded', 'has-text-weight-semibold', {
        'is-loading': creatingPlaylist,
      })}
      disabled={working}
    >
      <span className="icon" key="fa-asterisk">
        <i className="fas fa-asterisk"></i>
      </span>
      <span>Create</span>
    </button>
  );
}

export default Actions;
