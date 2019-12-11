import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from '@reach/router';
import queryString from 'query-string';
import { getNonce } from '../selectors';
import { sync } from '../actions';

function Auth() {
  const dispatch = useDispatch();
  const hash = queryString.parse(window.location.hash);
  const nonce = useSelector(getNonce);

  if (!hash.access_token || hash.state !== nonce) {
    alert(`Invalid request`);

    return null;
  }

  dispatch(sync(hash.access_token));

  return <Redirect to="/" noThrow />;
}

export default Auth;
