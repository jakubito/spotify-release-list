# Privacy Policy

Spotify Release List is a simple application written in Javascript that runs entirely in your browser.

## Motivation

The idea behind this app is not new. [Almost 2000 people have requested this basic feature over the course of 5 years](https://community.spotify.com/t5/Live-Ideas/Discover-New-Release-Section-for-Followed-Artists/idi-p/949039). I didn't wait for Spotify and decided to build it myself. I also made sure there is no cost of running this project online - [Netlify](https://www.netlify.com/) provides everything for free (Thanks Netlify!).

**Spotify Release List is a hobby project with no revenue, no ads and is 100% free to use.**

## Services

There are two external services that are being used by the app - Spotify and Sentry.

### Spotify

[Spotify Web API](https://developer.spotify.com/documentation/web-api/) is used to fetch all data about the artists you follow and their releases. It uses [Implicit Grant Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow) as authorization mechanism. This means all communication is happening strictly between your browser and Spotify servers.

### Sentry

[Sentry](https://sentry.io/) is a 3rd party service used to track errors encountered by users. It helps me to track bugs that would not be reported otherwise. When an error occurs while using the app, essential information about the error is automatically sent to Sentry for further inspection. No personal information is being collected. The list of data being sent is limited to:

- Error message
- [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) header (anonymous information about browser and operating system being used)

Sentry also saves IP addresses by default, but I turned this option off for better privacy. **No IP addresses are being saved.**

## Data Storage

All application data is stored locally in your browser's storage. You can delete this data anytime by clicking on **[Delete all data]** button located at the bottom of **Settings** modal.

## Questions

If you have question about this Privacy Policy, please contact me at dobes.jakub@gmail.com
