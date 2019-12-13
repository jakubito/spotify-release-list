import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from '@reach/router';
import queryString from 'query-string';
import addSeconds from 'date-fns/addSeconds';
import { getNonce } from '../selectors';
import { sync, setToken } from '../actions';

function Auth() {
  const dispatch = useDispatch();
  const search = queryString.parse(window.location.search);
  const hash = queryString.parse(window.location.hash);
  const nonce = useSelector(getNonce);

  if (search.error) {
    alert('Access denied ◕︵◕');

    return null;
  }

  if (!hash.access_token || !hash.expires_in || hash.state !== nonce) {
    alert(`Invalid request ◴_◶`);

    return null;
  }

  const token = hash.access_token;
  const tokenExpires = addSeconds(new Date(), Number(hash.expires_in) - 120).toISOString();

  dispatch(setToken(token, tokenExpires));
  dispatch(sync());

  return <Redirect to="/" noThrow />;
}

export default Auth;
