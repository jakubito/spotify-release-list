import React from 'react';

function Loading() {
  return (
    <div className="center loading has-text-light has-text-weight-semibold is-size-5 is-hidden-mobile">
      <progress className="progress is-small is-success"></progress>
      Loading...
    </div>
  );
}

export default Loading;
