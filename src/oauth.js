import config from './config.json';

export function authorize(nonce) {
  const params = new URLSearchParams({
    client_id: config.SPOTIFY_CLIENT_ID,
    response_type: 'token',
    scope: 'user-follow-read',
    redirect_uri: process.env.REACT_APP_URL + '/auth/',
    state: nonce,
    show_dialog: false,
  });

  const url = `https://accounts.spotify.com/authorize?${params}`;

  window.location.replace(url);
}
