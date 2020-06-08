import React, { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import classNames from 'classnames';

function windowScrollToTop() {
  window.scrollTo(0, 0);
}

function useBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      throttle(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        setVisible(scrollTop > 200);
      }, 200)
    );
  }, []);

  return visible;
}

function BackToTop() {
  const visible = useBackToTop();

  return (
    <button
      onClick={windowScrollToTop}
      className={classNames('BackToTop button is-medium is-dark is-rounded', { visible })}
      title="Back to top"
    >
      <span className="icon">
        <i className="fas fa-arrow-up"></i>
      </span>
    </button>
  );
}

export default BackToTop;
