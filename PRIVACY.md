# Privacy Policy

Spotify Release List is a simple application written in Javascript that runs entirely in your browser.

## Services

There are two external services being used by the app - Spotify and Sentry.

### Spotify

[Spotify Web API](https://developer.spotify.com/documentation/web-api/) is used to fetch all data about the artists you follow and their releases. It uses [Authorization Code Flow with Proof Key for Code Exchange (PKCE)](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) as authorization mechanism. All communication is happening strictly between your browser and Spotify servers.

### Sentry

[Sentry](https://sentry.io/) is a 3rd party service used to track errors encountered by users. It helps me to track bugs that would not be reported otherwise. When an error occurs while using the app, essential information about the error is automatically sent to Sentry for further inspection. No personal information is being collected. The list of data being sent is limited to:

- Error message
- [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) header (anonymous information about browser and operating system being used)

Sentry also saves IP addresses by default, but I turned this option off for better privacy. No IP addresses are being saved.

## Authorization scopes

You might be hesitant to allow a 3rd party app to acces your data (I know I am). For the sake of transparency, let me give you an overview of all the scopes (permissions) being used by the app:

- `user-follow-read` - The only required scope. This allows the app to get the list of artists you follow.
- `playlist-modify-private` - Allows the app to export releases to a new private playlist.
- `playlist-modify-public` - Allows the app to export releases to a new public playlist.

All scopes are asked for progressively (only when they are needed). You can use the app with the default (read-only) scope just fine.

Your existing playlist data is never touched. Feel free to check the code.

If you want to remove previously authorized access, you can do it anytime on your [Spotify profile page](https://spotify.com/account/apps).

[Official authorization scopes documentation](https://developer.spotify.com/documentation/general/guides/scopes)

## Data Storage

All application data is stored locally in your [browser's storage](https://github.com/localForage/localForage). You can delete this data anytime by clicking on **[Delete app data]** button located at the bottom of **General settings** screen.

## Questions

If you have question about this Privacy Policy, please contact me at dobes.jakub@gmail.com
