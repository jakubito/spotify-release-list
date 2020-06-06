# Privacy Policy

Spotify Release List is a simple application written in Javascript that runs entirely in your browser.

## Services

There are two external services that are being used by the app - Spotify and Sentry.

### Spotify

[Spotify Web API](https://developer.spotify.com/documentation/web-api/) is used to fetch all data about the artists you follow and their releases. It uses [Implicit Grant Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow) as authorization mechanism. This means all communication is happening strictly between your browser and Spotify servers.

### Sentry

[Sentry](https://sentry.io/) is a 3rd party service used to track errors encountered by users. It helps me to track bugs that would not be reported otherwise. When an error occurs while using the app, essential information about the error will be automatically sent to Sentry for further inspection. No personal information is being collected. The list of data being sent is limited to:

- Error message
- [User-agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) header (information about your browser + operating system)

## Data Storage

All application data is stored locally in your browser's storage. You can delete this data anytime by clicking on **[Delete all data]** button located at the bottom of **Settings** modal.

## Questions

If you have question about this Privacy Policy, please contact me at dobes.jakub@gmail.com
