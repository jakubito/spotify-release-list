import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getSettingsUriLinks } from 'selectors';

function Link({ uri, url, newTab = true, children, ...propsRest }) {
  const uriLinks = useSelector(getSettingsUriLinks);
  let props = propsRest;

  if (!uriLinks && newTab) {
    props = {
      ...props,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return (
    <a href={uriLinks ? uri : url} {...props}>
      {children}
    </a>
  );
}

Link.propTypes = {
  uri: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  newTab: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Link;
