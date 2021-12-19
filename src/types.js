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
 *   lastSettingsPath?: string
 *   labelBlocklistHeight?: number
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
 *   displayTracks: boolean
 *   fullAlbumData: boolean
 *   displayLabels: boolean
 *   displayPopularity: boolean
 *   labelBlocklist: string
 * }} Settings
 *
 * @typedef {{
 *   groups: AlbumGroup[]
 *   search: string
 *   startDate?: string
 *   endDate?: string
 *   excludeVariousArtists: boolean
 *   excludeRemixes: boolean
 *   excludeDuplicates: boolean
 *   favoritesOnly: boolean
 * }} Filters
 *
 * @typedef {{
 *   id: string
 *   name: string
 *   image: string
 *   releaseDate: string
 *   totalTracks: number
 *   label?: string
 *   popularity?: number
 * }} AlbumBase
 *
 * @typedef {AlbumBase & {
 *   artistIds: { [key in AlbumGroup]?: string[] }
 *   albumArtists: Artist[]
 * }} AlbumRaw
 *
 * @typedef {AlbumBase & {
 *   artists: { [key in AlbumGroup]?: Artist[] }
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
 *   newBadge?: boolean
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
 * @typedef {{ [key in AlbumGroup]?: string[] }} ReleasesGroupMap
 * @typedef {{ startDate?: Moment, endDate?: Moment }} StartEndDates
 * @typedef {{ value: number }} Progress
 * @typedef {(...args: any[]) => any} Fn
 * @typedef {[value: string, label: string][]} SelectOptions
 * @typedef {{ [key in AlbumGroup]: string }} GroupColorScheme
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
 * @template [T=any]
 * @typedef {Channel<ResponseChannelMessage<T>>} ResponseChannel<T>
 */

/**
 * @template T
 * @typedef {T extends PromiseLike<infer U> ? Await<U> : T} Await<T>
 */

/**
 * @template T
 * @typedef {T[keyof T]} Values<T>
 */

/**
 * Enums
 *
 * @typedef {import('./enums').Address} Address
 * @typedef {import('./enums').Scope} Scope
 * @typedef {import('./enums').SpotifyEntity} SpotifyEntity
 * @typedef {import('./enums').MomentFormat} MomentFormat
 * @typedef {import('./enums').Theme} Theme
 * @typedef {import('./enums').Market} Market
 *
 * @typedef {{
 *   ALBUM: 'album'
 *   SINGLE: 'single'
 *   COMPILATION: 'compilation'
 *   APPEARS_ON: 'appears_on'
 * }} AlbumGroupEnum
 * @typedef {Values<AlbumGroupEnum>} AlbumGroup
 * @typedef {Values<Omit<AlbumGroupEnum, 'APPEARS_ON'>>} AlbumType
 */

/**
 * Actions
 *
 * @typedef {ReturnType<typeof import('state/actions').authorize>} AuthorizeAction
 * @typedef {ReturnType<typeof import('state/actions').authorizeStart>} AuthorizeStartAction
 * @typedef {ReturnType<typeof import('state/actions').authorizeFinished>} AuthorizeFinishedAction
 * @typedef {ReturnType<typeof import('state/actions').authorizeError>} AuthorizeErrorAction
 * @typedef {ReturnType<typeof import('state/actions').sync>} SyncAction
 * @typedef {ReturnType<typeof import('state/actions').syncStart>} SyncStartAction
 * @typedef {ReturnType<typeof import('state/actions').syncFinished>} SyncFinishedAction
 * @typedef {ReturnType<typeof import('state/actions').syncError>} SyncErrorAction
 * @typedef {ReturnType<typeof import('state/actions').syncCancel>} SyncCancelAction
 * @typedef {ReturnType<typeof import('state/actions').setSyncingProgress>} SetSyncingProgressAction
 * @typedef {ReturnType<typeof import('state/actions').reset>} ResetAction
 * @typedef {ReturnType<typeof import('state/actions').setSettings>} SetSettingsAction
 * @typedef {ReturnType<typeof import('state/actions').showPlaylistModal>} ShowPlaylistModalAction
 * @typedef {ReturnType<typeof import('state/actions').hidePlaylistModal>} HidePlaylistModalAction
 * @typedef {ReturnType<typeof import('state/actions').showMessage>} ShowMessageAction
 * @typedef {ReturnType<typeof import('state/actions').showErrorMessage>} ShowErrorMessageAction
 * @typedef {ReturnType<typeof import('state/actions').hideMessage>} HideMessageAction
 * @typedef {ReturnType<typeof import('state/actions').setPlaylistForm>} SetPlaylistFormAction
 * @typedef {ReturnType<typeof import('state/actions').createPlaylist>} CreatePlaylistAction
 * @typedef {ReturnType<typeof import('state/actions').createPlaylistStart>} CreatePlaylistStartAction
 * @typedef {ReturnType<typeof import('state/actions').createPlaylistFinished>} CreatePlaylistFinishedAction
 * @typedef {ReturnType<typeof import('state/actions').createPlaylistError>} CreatePlaylistErrorAction
 * @typedef {ReturnType<typeof import('state/actions').createPlaylistCancel>} CreatePlaylistCancelAction
 * @typedef {ReturnType<typeof import('state/actions').resetPlaylist>} ResetPlaylistAction
 * @typedef {ReturnType<typeof import('state/actions').addSeenFeature>} AddSeenFeatureAction
 * @typedef {ReturnType<typeof import('state/actions').toggleFiltersVisible>} ToggleFiltersVisibleAction
 * @typedef {ReturnType<typeof import('state/actions').setFilters>} SetFiltersAction
 * @typedef {ReturnType<typeof import('state/actions').resetFilters>} ResetFiltersAction
 * @typedef {ReturnType<typeof import('state/actions').autoSyncStart>} AutoSyncStartAction
 * @typedef {ReturnType<typeof import('state/actions').autoSyncStop>} AutoSyncStopAction
 * @typedef {ReturnType<typeof import('state/actions').updateReady>} UpdateReadyAction
 * @typedef {ReturnType<typeof import('state/actions').dismissUpdate>} DismissUpdateAction
 * @typedef {ReturnType<typeof import('state/actions').triggerUpdate>} TriggerUpdateAction
 * @typedef {ReturnType<typeof import('state/actions').setFavorite>} SetFavoriteAction
 * @typedef {ReturnType<typeof import('state/actions').setFavoriteAll>} SetFavoriteAllAction
 * @typedef {ReturnType<typeof import('state/actions').toggleEditingFavorites>} ToggleEditingFavoritesAction
 * @typedef {ReturnType<typeof import('state/actions').setLastSettingsPath>} SetLastSettingsPathAction
 *
 * @typedef {AuthorizeAction
 *   | AuthorizeStartAction
 *   | AuthorizeFinishedAction
 *   | AuthorizeErrorAction
 *   | SyncAction
 *   | SyncStartAction
 *   | SyncFinishedAction
 *   | SyncErrorAction
 *   | SyncCancelAction
 *   | SetSyncingProgressAction
 *   | ResetAction
 *   | SetSettingsAction
 *   | ShowPlaylistModalAction
 *   | HidePlaylistModalAction
 *   | ShowMessageAction
 *   | ShowErrorMessageAction
 *   | HideMessageAction
 *   | SetPlaylistFormAction
 *   | CreatePlaylistAction
 *   | CreatePlaylistStartAction
 *   | CreatePlaylistFinishedAction
 *   | CreatePlaylistErrorAction
 *   | CreatePlaylistCancelAction
 *   | ResetPlaylistAction
 *   | AddSeenFeatureAction
 *   | ToggleFiltersVisibleAction
 *   | SetFiltersAction
 *   | ResetFiltersAction
 *   | AutoSyncStartAction
 *   | AutoSyncStopAction
 *   | UpdateReadyAction
 *   | DismissUpdateAction
 *   | TriggerUpdateAction
 *   | SetFavoriteAction
 *   | SetFavoriteAllAction
 *   | ToggleEditingFavoritesAction
 *   | SetLastSettingsPathAction} Action
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
 *   album_type: AlbumType
 *   total_tracks: number
 * }} SpotifyAlbum
 *
 * @typedef {Omit<SpotifyAlbum, 'album_group'> & {
 *   label: string
 *   popularity: number
 *   tracks: Paged<SpotifyTrack>
 * }} SpotifyAlbumFull
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

/**
 * @template P,[T=string]
 * @typedef {import('@reduxjs/toolkit').ActionCreatorWithPayload<P,T>} ActionCreatorWithPayload<P,T>
 */

/**
 * @template P,[T=string]
 * @typedef {import('@reduxjs/toolkit').ActionCreatorWithOptionalPayload<P,T>} ActionCreatorWithOptionalPayload<P,T>
 */

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').Draft<T>} Draft<T>
 */
