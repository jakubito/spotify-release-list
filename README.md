# Spotify Release List

Display list of Spotify releases from artists you follow

**<https://spotifyreleaselist.netlify.app>**

[▶️ Live demo](https://demo--spotifyreleaselist.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/5b14f602-d76e-47e0-8c3e-6af38e9d49f6/deploy-status)](https://app.netlify.com/sites/spotifyreleaselist/deploys)

![screenshot.jpg](https://raw.githubusercontent.com/jakubito/spotify-release-list-web/master/public/screenshot.jpg?v=1)

## Features

- Display releases day by day - you won't miss a thing!
- Filter by text search, date range and group type
- Export to playlists
- Installable progressive web application (PWA) with fullscreen and offline support
- All application data stored locally on your device
- Completely free to use with no ads and no tracking

## Keyboard shortcuts

<kbd>R</kbd> Refresh  
<kbd>S</kbd> Show settings  
<kbd>F</kbd> Toggle filters pane  
<kbd>D</kbd> Toggle favorites edit mode  
<kbd>E</kbd> Export to a new playlist  
<kbd>U</kbd> Export to an existing playlist  
<kbd>ESC</kbd> Cancel / Close active modal

## Troubleshooting

The app has been developed and tested in Chrome, but it should work in any other modern browser. If something's not working, please try the following before you report a bug:

- [Some privacy-oriented extensions](https://github.com/jakubito/spotify-release-list/issues/36) or browsers may block communication to Spotify servers. Try adding an exemption or using a different browser.
- Delete app data (see [General settings screen](https://spotifyreleaselist.netlify.app/settings))
- [Remove Spotify Release List app access](https://www.spotify.com/account/apps)
- If everything else fails, you can try to [Sign out everywhere](https://www.spotify.com/account/overview)

## Installation

1. Install dependencies with `yarn install`
2. Save app url to `REACT_APP_URL` environment variable
3. Save Spotify app's client ID to `REACT_APP_SPOTIFY_CLIENT_ID` environment variable
4. Set your Spotify app's Redirect URI to the `REACT_APP_URL` + `/auth`
5. Run `yarn start` to run dev server or `yarn build` to build the app

## Privacy Policy

See [PRIVACY.md](https://github.com/jakubito/spotify-release-list/blob/master/PRIVACY.md)

## Bug reporting

If you find a bug, please send me an e-mail to dobes.jakub@gmail.com or open an issue here on github.

## License

ISC
