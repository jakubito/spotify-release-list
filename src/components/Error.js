import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getErrorMessage } from 'selectors';
import { hideErrorMessage } from 'actions';

function Error() {
  const errorMessage = useSelector(getErrorMessage);
  const dispatch = useDispatch();
  const hide = useCallback(() => {
    dispatch(hideErrorMessage());
  }, []);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="Error notification is-danger has-text-centered">
      <button className="delete" onClick={hide} title="Close"></button>
      {errorMessage}
    </div>
  );
}

export default Error;
