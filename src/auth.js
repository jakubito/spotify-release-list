import moment from 'moment';
import { Base64 } from 'js-base64';
import { SYNC, CREATE_PLAYLIST } from './actions';
import { Scope } from './enums';

export function isValidSyncToken(token, tokenExpires, tokenScope) {
  return (
    isValidToken(token, tokenExpires) && tokenScope && tokenScope.includes(Scope.USER_FOLLOW_READ)
  );
}

export function isValidCreatePlaylistToken(token, tokenExpires, tokenScope, isPrivate) {
  return (
    isValidToken(token, tokenExpires) &&
    tokenScope &&
    tokenScope.includes(isPrivate ? Scope.PLAYLIST_MODIFY_PRIVATE : Scope.PLAYLIST_MODIFY_PUBLIC)
  );
}

function isValidToken(token, tokenExpires) {
  return token && tokenExpires && moment().isBefore(tokenExpires);
}

export function startSyncAuthFlow(nonce) {
  startAuthFlow(SYNC, Scope.USER_FOLLOW_READ, nonce);
}

export function startCreatePlaylistAuthFlow(nonce, isPrivate) {
  startAuthFlow(
    CREATE_PLAYLIST,
    [
      Scope.USER_FOLLOW_READ,
      isPrivate ? Scope.PLAYLIST_MODIFY_PRIVATE : Scope.PLAYLIST_MODIFY_PUBLIC,
    ].join(' '),
    nonce
  );
}

function startAuthFlow(action, scope, nonce) {
  const state = Base64.encodeURI(JSON.stringify({ action, scope, nonce }));

  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_URL + '/auth/',
    response_type: 'token',
    show_dialog: false,
    scope,
    state,
  });

  const url = `https://accounts.spotify.com/authorize?${params}`;

  window.location.replace(url);
}
