import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from '@reach/router';
import queryString from 'query-string';
import addSeconds from 'date-fns/addSeconds';
import { getNonce } from '../selectors';
import {
  SYNC,
  CREATE_PLAYLIST,
  sync,
  setToken,
  showErrorMessage,
  createPlaylist,
} from '../actions';

function Auth() {
  const dispatch = useDispatch();
  const nonce = useSelector(getNonce);
  const search = queryString.parse(window.location.search);
  const redirectHome = <Redirect to="/" noThrow />;

  if (search.error) {
    dispatch(showErrorMessage('Error: Access denied.'));

    return redirectHome;
  }

  const hash = queryString.parse(window.location.hash);
  const state = JSON.parse(atob(hash.state));

  if (!hash.access_token || !hash.expires_in || state.nonce !== nonce) {
    dispatch(showErrorMessage('Error: Invalid request.'));

    return redirectHome;
  }

  const token = hash.access_token;
  const tokenExpires = addSeconds(new Date(), Number(hash.expires_in) - 120).toISOString();
  const { action, scope } = state;

  dispatch(setToken(token, tokenExpires, scope));

  if (action === SYNC) {
    dispatch(sync());
  } else if (action === CREATE_PLAYLIST) {
    dispatch(createPlaylist());
  }

  return redirectHome;
}

export default Auth;
