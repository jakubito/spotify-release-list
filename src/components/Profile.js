import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Profile({ name, image, className }) {
  return (
    <div className={classNames('Profile has-text-grey', className)}>
      {name}
      {image && (
        <figure className="image">
          <img className="is-rounded" src={image} title={name} alt={name} />
        </figure>
      )}
    </div>
  );
}

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  className: PropTypes.string,
};

export default Profile;
