import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function windowScrollToTop() {
  window.scrollTo(0, 0);
}

function BackToTop({ className }) {
  return (
    <button
      onClick={windowScrollToTop}
      className={classNames('BackToTop button is-medium is-dark is-rounded', className)}
      title="Back to top"
    >
      <span className="icon">
        <i className="fas fa-arrow-up"></i>
      </span>
    </button>
  );
}

BackToTop.propTypes = {
  className: PropTypes.string,
};

export default BackToTop;
