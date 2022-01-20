/**
 * Custom types
 *
 * @typedef {{
 *   authorizing: boolean
 *   albums: AlbumsMap
 *   syncing: boolean
 *   syncingProgress: number
 *   lastSync?: string
 *   lastAutoSync?: string
 *   previousSyncMaxDate?: string
 *   creatingPlaylist: boolean
 *   playlistId?: string
 *   playlistForm: PlaylistForm
 *   user?: User
 *   message?: Message
 *   playlistModalVisible: boolean
 *   filtersVisible: boolean
 *   settings: Settings
 *   filters: Filters
 *   seenFeatures: string[]
 *   updateReady: boolean
 *   favorites: Favorites
 *   editingFavorites: boolean
 * }} State
 *
 * @typedef {{
 *   nonce?: string
 *   codeVerifier?: string
 *   token?: string
 *   tokenScope?: string
 *   tokenExpires?: string
 *   refreshToken?: string
 * }} AuthData
 *
 * @typedef {{
 *   name?: string
 *   description?: string
 *   isPrivate?: boolean
 * }} PlaylistForm
 *
 * @typedef {{
 *   text: string
 *   type: 'normal' | 'info' | 'error'
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
 *   autoSync: boolean
 *   autoSyncTime: string
 *   notifications: boolean
 *   firstDayOfWeek: number
 * }} Settings
 *
 * @typedef {{
 *   groups: AlbumGroup[]
 *   search: string
 *   startDate?: string
 *   endDate?: string
 *   excludeVariousArtists: boolean
 *   excludeDuplicates: boolean
 *   favoritesOnly: boolean
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
 *   compact?: boolean
 * }} ButtonProps
 *
 * @typedef {{
 *   token: string
 *   tokenScope: string
 *   tokenExpires: string
 *   refreshToken: string
 * }} TokenApiResult
 *
 * @typedef {{ id: string, name: string, image: string }} User
 * @typedef {{ id: string, name: string }} Artist
 * @typedef {{ [id: string]: Artist }} ArtistsMap
 * @typedef {{ [id: string]: Album }} AlbumsMap
 * @typedef {{ [date: string]: Album[] }} ReleasesMap
 * @typedef {{ [id: string]: boolean }} Favorites
 * @typedef {{ date: string, albums: Album[] }[]} Releases
 * @typedef {{ [group: string]: string[] }} ReleasesGroupMap
 * @typedef {{ startDate?: Moment, endDate?: Moment }} StartEndDates
 * @typedef {{ type: string, payload: any }} Action
 * @typedef {(...args: any[]) => Action} ActionCreator
 * @typedef {{ value: number }} Progress
 * @typedef {(...args: any[]) => any} Fn
 * @typedef {[value: string, label: string][]} SelectOptions
 * @typedef {{ [group: string]: string }} GroupColorScheme
 * @typedef {(to: string) => Promise<void>} Navigate
 * @typedef {[Fn, ...any[]]} RequestChannelMessage
 * @typedef {Channel<RequestChannelMessage>} RequestChannel
 * @typedef {(data: Settings) => string} SettingsSerializer
 * @typedef {JTDParser<Settings>} SettingsParser
 * @typedef {Record<string, unknown>} SentryContext
 * @typedef {Record<string, SentryContext>} SentryContexts
 */

/**
 * @template T
 * @typedef {{ result?: T, error?: import('api').FetchError }} ResponseChannelMessage<T>
 */

/**
 * @template T
 * @typedef {Channel<ResponseChannelMessage<T>>} ResponseChannel<T>
 */

/**
 * @template T
 * @typedef {T extends PromiseLike<infer U> ? Await<U> : T} Await<T>
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
 * Actions
 *
 * @typedef {ReturnType<import('state/actions').authorize>} AuthorizeAction
 * @typedef {ReturnType<import('state/actions').authorizeError>} AuthorizeErrorAction
 * @typedef {ReturnType<import('state/actions').setSettings>} SetSettingsAction
 * @typedef {ReturnType<import('state/actions').setUser>} SetUserAction
 * @typedef {ReturnType<import('state/actions').reset>} ResetAction
 * @typedef {ReturnType<import('state/actions').sync>} SyncAction
 * @typedef {ReturnType<import('state/actions').createPlaylist>} CreatePlaylistAction
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
 *
 * @typedef {{
 *   access_token: string
 *   scope: string
 *   expires_in: number
 *   refresh_token: string
 * }} TokenApiResponse
 */

/**
 * @template T
 * @typedef {{ items: T[], next: string | null }} Paged<T>
 */

/**
 * Imported types
 *
 * @typedef {import('redux-persist').PersistedState & State} PersistedState
 * @typedef {import('redux-saga').Task} Task
 * @typedef {moment.Moment} Moment
 */

/**
 * @template T
 * @typedef {import('redux-saga').Channel<T>} Channel<T>
 */

/**
 * @template T
 * @typedef {import('redux-saga').EventChannel<T>} EventChannel<T>
 */

/**
 * @template T
 * @typedef {import('ajv/dist/types').JTDParser<T>} JTDParser<T>
 */

/**
 * @template T
 * @typedef {import('react-hook-form').SubmitHandler<T>} SubmitHandler<T>
 */
