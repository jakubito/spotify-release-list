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
- **Label Explorer** - Search and explore releases by record label
- **Artist Management** - Manage your followed artists directly in the app
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
<kbd>C</kbd> Export to CSV file  
<kbd>ESC</kbd> Cancel / Close active modal

## New Features

### Label Explorer
- Search for releases by record label
- Filter results by year and sort order
- Create playlists from selected label releases
- Save favorite labels for quick access

### Artist Management
- View all followed artists in a searchable, sortable list
- Bulk unfollow artists
- Search and filter your followed artists

### Enhanced Filtering
- Filter by track count (minimum and maximum)
- New releases filter (requires album history tracking)
- Improved Various Artists and remix filtering

## Installation

1. Install dependencies with `yarn install`
2. Copy environment variables: `cp .env.example .env`
3. Configure your Spotify app:
   - Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add your app's Client ID to `REACT_APP_SPOTIFY_CLIENT_ID` in `.env`
   - Set your app's Redirect URI to `{REACT_APP_URL}/auth`
4. (Optional) Add Sentry DSN to `REACT_APP_SENTRY_DSN` for error tracking
5. Run `yarn start` to start the development server or `yarn build` to build for production

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_URL` | The URL where your app is hosted | Yes |
| `REACT_APP_SPOTIFY_CLIENT_ID` | Your Spotify app's Client ID | Yes |
| `REACT_APP_SENTRY_DSN` | Sentry DSN for error tracking | No |

## Development

### Available Scripts

- `yarn start` - Start development server with hot reload
- `yarn build` - Create production build
- `yarn test` - Run test suite
- `yarn prettify` - Format code with Prettier
- `yarn analyze` - Analyze bundle size

### Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components
│   ├── filters/        # Filter components
│   ├── labels/         # Label Explorer components
│   ├── modals/         # Modal dialogs
│   ├── playlist/       # Playlist creation components
│   ├── releases/       # Release display components
│   └── settings/       # Settings components
├── sagas/              # Redux Saga files
├── state/              # Redux store and slices
├── styles/             # SCSS stylesheets
├── helpers.js          # Utility functions
├── api.js              # Spotify API wrapper
├── auth.js             # Authentication logic
└── enums.js            # Constants and enums
```

### Key Technologies

- **React 18** with hooks and functional components
- **Redux Toolkit** with Redux Saga for state management
- **Bulma CSS** framework with custom SCSS
- **Spotify Web API** with OAuth 2.0 PKCE authentication
- **LocalForage** for persistent storage
- **Workbox** for PWA functionality

## Troubleshooting

The app has been developed and tested in Chrome, but it should work in any other modern browser. If something's not working, please try the following before you report a bug:

- [Some privacy-oriented extensions](https://github.com/jakubito/spotify-release-list/issues/36) or browsers may block communication to Spotify servers. Try adding an exemption or using a different browser.
- Delete app data (see [General settings screen](https://spotifyreleaselist.netlify.app/settings))
- [Remove Spotify Release List app access](https://www.spotify.com/account/apps)
- If everything else fails, you can try to [Sign out everywhere](https://www.spotify.com/account/overview)

### Common Issues

1. **Build Warnings**: The app may show CSS autoprefixer warnings about `end` values. These are non-breaking and can be ignored or fixed by using `flex-end` instead.

2. **ESLint Warnings**: Some unused imports may trigger warnings during development. These can be safely ignored if they don't affect functionality.

3. **Rate Limiting**: The Spotify API has rate limits. The app includes automatic retry logic with exponential backoff.

## Privacy Policy

See [PRIVACY.md](https://github.com/jakubito/spotify-release-list/blob/master/PRIVACY.md)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run `yarn prettify` to format your code
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Bug reporting

If you find a bug, please send me an e-mail to dobes.jakub@gmail.com or open an issue here on github.

## License

ISC