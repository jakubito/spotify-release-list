/**
 * Custom types
 *
 * @typedef {{
 *   albums: { [id: string]: AlbumGrouped }
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
 *   errorMessage?: string
 *   settingsModalVisible: boolean
 *   resetModalVisible: boolean
 *   playlistModalVisible: boolean
 *   settings: Settings
 *   seenFeatures: Feature[]
 * }} State
 *
 * @typedef {{
 *   albumIds?: string[]
 *   name?: string
 *   description?: string
 *   isPrivate?: boolean
 * }} PlaylistForm
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
 *   id: string
 *   name: string
 *   image: string
 *   releaseDate: string
 *   artists: Artist[]
 *   artistId: string
 * }} Album
 *
 * @typedef {{
 *   id: string
 *   name: string
 *   image: string
 *   releaseDate: string
 *   artists: Artist[]
 *   primaryArtists: Artist[]
 * }} AlbumGrouped
 *
 * @typedef {{
 *   title: string | ((start: Moment, end: Moment) => string)
 *   start: Moment
 *   end: Moment
 * }} DateRangeShortcut
 *
 * @typedef {{ id: string, name: string, image: string }} User
 * @typedef {{ id: string, name: string }} Artist
 * @typedef {{ [date: string]: AlbumGrouped[] }} ReleasesMap
 * @typedef {[date: string, albums: AlbumGrouped[]][]} ReleasesSortedEntries
 * @typedef {{ [prop: string]: any }} AnyProps
 * @typedef {{ type: string, payload: any }} Action
 * @typedef {(...args: any[]) => Action} ActionCreator
 */

/**
 * Enums
 *
 * @typedef {string} Scope
 * @typedef {string} FieldName
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
 * }} SpotifyAlbum
 *
 * @typedef {{ width: number, height: number, url: string }} SpotifyImage
 * @typedef {{ id: string, display_name: string, images: SpotifyImage[] }} SpotifyUser
 * @typedef {{ id: string, name: string }} SpotifyArtist
 * @typedef {{ id: string, name: string }} SpotifyPlaylist
 * @typedef {{ snapshot_id: string }} SpotifyPlaylistSnapshot
 */

/**
 * Imported types
 *
 * @typedef {import('@reach/router').RouteComponentProps} RouteComponentProps
 * @typedef {import('redux-persist').PersistedState & State} PersistedState
 * @typedef {moment.Moment} Moment
 */
