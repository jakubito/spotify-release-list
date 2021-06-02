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
 *   playlistModalVisible: boolean
 *   filtersVisible: boolean
 *   settings: Settings
 *   filters: Filters
 *   seenFeatures: string[]
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
 *   groupColors: GroupColorScheme
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
 * }} AlbumBase
 *
 * @typedef {AlbumBase & {
 *   artistIds: { [group: string]: string[] }
 *   albumArtists: Artist[]
 * }} AlbumRaw
 *
 * @typedef {AlbumBase & {
 *   artists: { [group: string]: Artist[] }
 *   otherArtists: Artist[]
 * }} Album
 *
 * @typedef {{
 *   title: string | ((start: Moment, end: Moment) => string)
 *   start: Moment
 *   end: Moment
 * }} DateRangeShortcut
 *
 * @typedef {{
 *   type?: 'submit' | 'reset' | 'button'
 *   title?: string
 *   titleOnly?: string
 *   onClick?: React.MouseEventHandler<HTMLButtonElement>
 *   children?: React.ReactNode
 *   icon?: string
 *   disabled?: boolean
 *   className?: string
 *   small?: boolean
 *   medium?: boolean
 *   dark?: boolean
 *   darker?: boolean
 *   primary?: boolean
 *   danger?: boolean
 *   text?: boolean
 *   style?: React.CSSProperties
 * }} ButtonProps
 *
 * @typedef {{ id: string, name: string, image: string }} User
 * @typedef {{ id: string, name: string }} Artist
 * @typedef {{ [id: string]: Artist }} ArtistsMap
 * @typedef {{ [id: string]: Album }} AlbumsMap
 * @typedef {{ [date: string]: Album[] }} ReleasesMap
 * @typedef {[date: string, albums: Album[]][]} ReleasesEntries
 * @typedef {{ [group: string]: string[] }} ReleasesGroupMap
 * @typedef {{ startDate?: Moment, endDate?: Moment }} StartEndDates
 * @typedef {{ type: string, payload: any }} Action
 * @typedef {(...args: any[]) => Action} ActionCreator
 * @typedef {{ value: number }} Progress
 * @typedef {(...args: any[]) => any} Fn
 * @typedef {[value: string, label: string][]} SelectOptions
 * @typedef {{ [group: string]: string }} GroupColorScheme
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
 * @typedef {import('./enums').Address} Address
 * @typedef {import('./enums').Scope} Scope
 * @typedef {import('./enums').SpotifyEntity} SpotifyEntity
 * @typedef {import('./enums').MomentFormat} MomentFormat
 * @typedef {import('./enums').AlbumGroup} AlbumGroup
 * @typedef {import('./enums').Theme} Theme
 * @typedef {import('./enums').Market} Market
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
