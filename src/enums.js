const GITHUB = 'https://github.com/jakubito/spotify-release-list'

/** @enum {string} */
export const Address = {
  GITHUB,
  GITHUB_PROFILE: 'https://github.com/jakubito',
  PRIVACY: `${GITHUB}/blob/master/PRIVACY.md`,
  CREDITS: `${GITHUB}/blob/master/CREDITS.md`,
  CHANGELOG: `${GITHUB}/releases`,
  DONATE: 'https://paypal.me/jakubito',
  EMAIL: 'mailto:dobes.jakub@gmail.com',
  DEMO: 'https://demo--spotifyreleaselist.netlify.app',
}

/** @enum {string} */
export const Scope = {
  USER_FOLLOW_READ: 'user-follow-read',
  USER_LIBRARY_READ: 'user-library-read',
  PLAYLIST_MODIFY_PRIVATE: 'playlist-modify-private',
  PLAYLIST_MODIFY_PUBLIC: 'playlist-modify-public',
}

/** @enum {string} */
export const SpotifyEntity = {
  ALBUM: 'album',
  ARTIST: 'artist',
  PLAYLIST: 'playlist',
  TRACK: 'track',
}

/** @enum {string} */
export const MomentFormat = {
  ISO_DATE: 'YYYY-MM-DD',
  MONTH_NAME: 'MMMM',
}

/** @type {ArtistSourceEnum} */
export const ArtistSource = {
  FOLLOWED: 'followed',
  SAVED_TRACKS: 'saved-tracks',
  SAVED_ALBUMS: 'saved-albums',
}

const { FOLLOWED, SAVED_TRACKS, SAVED_ALBUMS } = ArtistSource

/** @type {[group: ArtistSource, label: string][]} */
export const ArtistSourceLabels = [
  [FOLLOWED, 'Followed artists'],
  [SAVED_ALBUMS, 'Saved albums'],
  [SAVED_TRACKS, 'Liked songs'],
]

/** @type {ReleasesOrderEnum} */
export const ReleasesOrder = {
  ARTIST: 'artist',
  ALBUM_GROUP: 'album-group',
}

/** @type {[group: ReleasesOrder, label: string][]} */
export const ReleasesOrderLabels = [
  [ReleasesOrder.ARTIST, 'Artist name'],
  [ReleasesOrder.ALBUM_GROUP, 'Album type → Artist name'],
]

/** @type {AlbumGroupEnum} */
export const AlbumGroup = {
  ALBUM: 'album',
  SINGLE: 'single',
  COMPILATION: 'compilation',
  APPEARS_ON: 'appears_on',
}

const { ALBUM, SINGLE, COMPILATION, APPEARS_ON } = AlbumGroup

/** @type {{ [key in AlbumGroup]: number }} */
export const AlbumGroupIndex = {
  [ALBUM]: 0,
  [SINGLE]: 1,
  [COMPILATION]: 2,
  [APPEARS_ON]: 3,
}

/** @type {[group: AlbumGroup, label: string][]} */
export const AlbumGroupLabels = [
  [ALBUM, 'Albums'],
  [SINGLE, 'Singles'],
  [COMPILATION, 'Compilations'],
  [APPEARS_ON, 'Appearances'],
]

/** @enum {GroupColorScheme} */
export const GroupColorSchemes = {
  DEFAULT: {
    [ALBUM]: '#e04c71',
    [SINGLE]: '#a779c5',
    [COMPILATION]: '#dcad4f',
    [APPEARS_ON]: '#19a34a',
  },
  ORIGINAL: {
    [ALBUM]: '#19a34a',
    [SINGLE]: '#19a34a',
    [COMPILATION]: '#19a34a',
    [APPEARS_ON]: '#19a34a',
  },
  WHITE: {
    [ALBUM]: '#f5f5f5',
    [SINGLE]: '#f5f5f5',
    [COMPILATION]: '#f5f5f5',
    [APPEARS_ON]: '#f5f5f5',
  },
}

/** @enum {string} */
export const Theme = {
  COMPACT: 'theme-compact',
  SINGLE_COLUMN: 'theme-single-column',
}
