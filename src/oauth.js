/* global chrome */
import config from './config.json';

export function authorize() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      client_id: config.SPOTIFY_CLIENT_ID,
      response_type: 'token',
      scope: 'user-follow-read',
      redirect_uri: chrome.identity.getRedirectURL(),
    });

    chrome.identity.launchWebAuthFlow(
      {
        url: `https://accounts.spotify.com/authorize?${params}`,
        interactive: true,
      },
      (redirectUrl) => {
        const tokenMatch = redirectUrl && redirectUrl.match(/access_token=(.*?)&/);

        if (tokenMatch) {
          resolve(tokenMatch[1]);
        } else {
          reject('Cannot get token ☹️');
        }
      }
    );
  });
}
