import React from 'react';
import { useSelector } from 'react-redux';
import { getSyncingProgress } from 'selectors';

function Loading() {
  const syncingProgress = useSelector(getSyncingProgress);

  return (
    <div className="center loading has-text-light has-text-weight-semibold is-size-5">
      <progress className="progress is-small" value={syncingProgress} max="100">
        {syncingProgress}%
      </progress>
      Loading, please wait...
    </div>
  );
}

export default Loading;
