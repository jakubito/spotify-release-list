/**
 * Custom types
 *
 * @typedef {{
 *   albums: AlbumsMap
 *   syncing: boolean
 *   syncingProgress: number
 *   lastSync?: string
 *   previousSyncMaxDate?: string
 *   creatingPlaylist: boolean
 *   playlistId?: string
 *   playlistForm: PlaylistForm
 *   token?: string
 *   tokenExpires?: string
 *   tokenScope?: string
 *   user?: User
 *   nonce?: string
 *   message?: Message
 *   settingsModalVisible: boolean
 *   resetModalVisible: boolean
 *   playlistModalVisible: boolean
 *   filtersVisible: boolean
 *   settings: Settings
 *   filters: Filters
 *   seenFeatures: Feature[]
 * }} State
 *
 * @typedef {{
 *   name?: string
 *   description?: string
 *   isPrivate?: boolean
 * }} PlaylistForm
 *
 * @typedef {{
 *   text: string
 *   type: 'normal' | 'error'
 * }} Message
 *
 * @typedef {{
 *   groups: AlbumGroup[]
 *   days: number
 *   market: Market
 *   theme: string
 *   uriLinks: boolean
 *   covers: boolean
 * }} Settings
 *
 * @typedef {{
 *   groups: AlbumGroup[]
 *   search: string
 *   startDate?: string
 *   endDate?: string
 *   excludeVariousArtists: boolean
 * }} Filters
 *
 * @typedef {{
 *   id: string
 *   name: string
 *   image: string
 *   releaseDate: string
 *   artists: Artist[]
 * }} AlbumBase
 *
 * @typedef {AlbumBase & { group: AlbumGroup, artistId: string }} Album
 * @typedef {AlbumBase & { groups: AlbumGroup[], otherArtists: Artist[] }} AlbumGrouped
 *
 * @typedef {{
 *   title: string | ((start: Moment, end: Moment) => string)
 *   start: Moment
 *   end: Moment
 * }} DateRangeShortcut
 *
 * @typedef {{ id: string, name: string, image: string }} User
 * @typedef {{ id: string, name: string }} Artist
 * @typedef {{ [id: string]: AlbumGrouped }} AlbumsMap
 * @typedef {{ [date: string]: AlbumGrouped[] }} ReleasesMap
 * @typedef {[date: string, albums: AlbumGrouped[]][]} ReleasesEntries
 * @typedef {{ [group: string]: string[] }} ReleasesGroupMap
 * @typedef {{ startDate?: Moment, endDate?: Moment }} StartEndDates
 * @typedef {{ [prop: string]: any }} AnyProps
 * @typedef {{ type: string, payload: any }} Action
 * @typedef {(...args: any[]) => Action} ActionCreator
 * @typedef {{ value: number }} Progress
 * @typedef {(...args: any[]) => any} Fn
 */

/**
 * @template T
 * @typedef {T extends {
 *   then(onfulfilled?: (value: infer U) => unknown): unknown;
 * } ? U : T} Await<T>
 */

/**
 * Enums
 *
 * @typedef {string} Scope
 * @typedef {string} SpotifyEntity
 * @typedef {string} MomentFormat
 * @typedef {string} AlbumGroup
 * @typedef {string} Feature
 * @typedef {string} Theme
 * @typedef {string} Market
 */

/**
 * Spotify objects
 *
 * @typedef {{
 *   id: string
 *   name: string
 *   images: SpotifyImage[]
 *   artists: SpotifyArtist[]
 *   release_date: string
 *   album_group: AlbumGroup
 * }} SpotifyAlbum
 *
 * @typedef {{ width: number, height: number, url: string }} SpotifyImage
 * @typedef {{ id: string, display_name: string, images: SpotifyImage[] }} SpotifyUser
 * @typedef {{ id: string, name: string }} SpotifyArtist
 * @typedef {{ id: string, name: string }} SpotifyPlaylist
 * @typedef {{ id: string }} SpotifyTrack
 * @typedef {{ snapshot_id: string }} SpotifyPlaylistSnapshot
 */

/**
 * @template T
 * @typedef {{ items: T[], next: string | null }} Paged<T>
 */

/**
 * Imported types
 *
 * @typedef {import('@reach/router').RouteComponentProps} RouteComponentProps
 * @typedef {import('redux-persist').PersistedState & State} PersistedState
 * @typedef {import('redux-saga').Channel} Channel
 * @typedef {import('redux-saga').Task} Task
 * @typedef {moment.Moment} Moment
 */
