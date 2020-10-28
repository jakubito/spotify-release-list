/**
 * @typedef {object} State
 * @prop {{ [id: string]: AlbumGrouped }} albums
 * @prop {boolean} syncing
 * @prop {number} syncingProgress
 * @prop {string} [lastSync]
 * @prop {string} [previousSyncMaxDate]
 * @prop {boolean} creatingPlaylist
 * @prop {string} [playlistId]
 * @prop {PlaylistForm} playlistForm
 * @prop {string} [token]
 * @prop {string} [tokenExpires]
 * @prop {string} [tokenScope]
 * @prop {User} [user]
 * @prop {string} [nonce]
 * @prop {string} [errorMessage]
 * @prop {boolean} settingsModalVisible
 * @prop {boolean} resetModalVisible
 * @prop {boolean} playlistModalVisible
 * @prop {Settings} settings
 * @prop {Feature[]} seenFeatures
 *
 * @typedef {object} PlaylistForm
 * @prop {string[]} [albumIds]
 * @prop {string} [name]
 * @prop {string} [description]
 * @prop {boolean} [isPrivate]
 *
 * @typedef {object} Settings
 * @prop {AlbumGroup[]} groups
 * @prop {number} days
 * @prop {Market} market
 * @prop {string} theme
 * @prop {boolean} uriLinks
 * @prop {boolean} covers
 *
 * @typedef {object} User
 * @prop {string} id
 * @prop {string} name
 * @prop {string} image
 *
 * @typedef {object} Artist
 * @prop {string} id
 * @prop {string} name
 *
 * @typedef {object} Album
 * @prop {string} id
 * @prop {string} name
 * @prop {string} image
 * @prop {string} releaseDate
 * @prop {Artist[]} artists
 * @prop {string} artistId
 *
 * @typedef {object} AlbumGrouped
 * @prop {string} id
 * @prop {string} name
 * @prop {string} image
 * @prop {string} releaseDate
 * @prop {Artist[]} artists
 * @prop {Artist[]} primaryArtists
 *
 * @typedef {object} SpotifyImage
 * @prop {number} width
 * @prop {number} height
 * @prop {string} url
 *
 * @typedef {object} SpotifyUser
 * @prop {string} id
 * @prop {string} display_name
 * @prop {SpotifyImage[]} images
 *
 * @typedef {object} SpotifyArtist
 * @prop {string} id
 * @prop {string} name
 *
 * @typedef {object} SpotifyAlbum
 * @prop {string} id
 * @prop {string} name
 * @prop {SpotifyImage[]} images
 * @prop {SpotifyArtist[]} artists
 * @prop {string} release_date
 *
 * @typedef {object} SpotifyPlaylist
 * @prop {string} id
 * @prop {string} name
 *
 * @typedef {object} SpotifyPlaylistSnapshot
 * @prop {string} snapshot_id
 *
 * @typedef {string} Scope
 * @typedef {string} FieldName
 * @typedef {string} SpotifyEntity
 * @typedef {string} MomentFormat
 * @typedef {string} AlbumGroup
 * @typedef {string} Feature
 * @typedef {string} Theme
 * @typedef {string} Market
 *
 * @typedef {object} Action
 * @prop {string} type
 * @prop {any} payload
 *
 * @typedef {Object} DateRangeShortcut
 * @property {string | ((start: Moment, end: Moment) => string)} title
 * @property {Moment} start
 * @property {Moment} end
 *
 * @typedef {(...args: any[]) => Action} ActionCreator
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('@reach/router').RouteComponentProps} RouteComponentProps
 * @typedef {import('redux-persist').PersistedState & State} PersistedState
 * @typedef {moment.Moment} Moment
 */
