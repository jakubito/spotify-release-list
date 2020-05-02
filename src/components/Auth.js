import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from '@reach/router';
import queryString from 'query-string';
import moment from 'moment';
import { Base64 } from 'js-base64';
import { getNonce } from '../selectors';
import {
  SYNC,
  CREATE_PLAYLIST,
  sync,
  setToken,
  showErrorMessage,
  createPlaylist,
} from '../actions';
import { Moment } from '../enums';

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
  const state = JSON.parse(Base64.decode(hash.state));

  if (!hash.access_token || !hash.expires_in || state.nonce !== nonce) {
    dispatch(showErrorMessage('Error: Invalid request.'));

    return redirectHome;
  }

  const token = hash.access_token;
  const tokenExpires = moment()
    .add(Number(hash.expires_in) - 120, Moment.SECOND)
    .toISOString();
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
