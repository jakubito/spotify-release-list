import last from 'lodash/last'
import { buildUser, buildArtist, buildAlbumRaw, sleep } from 'helpers'

/**
 * Default to account market
 */
const DEFAULT_MARKET = 'from_token'
const API_URL = 'https://api.spotify.com/v1'
const HTTP_TOO_MANY_REQUESTS = 429

/**
 * Represents an error encountered during data fetching
 */
export class FetchError extends Error {
  /**
   * @param {number} status
   * @param {string} statusText
   * @param {string} [message]
   */
  constructor(status, statusText, message) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.statusText = statusText
  }
}

/**
 * Return current user
 *
 * @param {string} token
 * @returns {Promise<User>}
 */
export async function getUser(token) {
  /** @type {SpotifyUser} */
  const userResponse = await get(apiUrl('me'), token)
  const user = buildUser(userResponse)

  return user
}

/**
 * Return current user's followed artists
 *
 * @param {string} token
 * @returns {Promise<Artist[]>}
 */
export async function getUserFollowedArtists(token) {
  /** @type {Artist[]} */
  const artists = []
  const params = new URLSearchParams({ limit: String(50), type: 'artist' })

  let next = apiUrl(`me/following?${params}`)

  while (next) {
    /** @type {{ artists: Paged<SpotifyArtist> }} */
    const response = await get(next, token)
    const nextArtists = response.artists.items.map(buildArtist)

    artists.push(...nextArtists)
    next = response.artists.next
  }

  return artists
}

/**
 * Return the artists whose songs the user has liked
 *
 * @param {string} token
 * @returns {Promise<Artist[]>}
 */
export async function getUserLikedSongArtists(token) {
  /** @type {Artist[]} */
  const artists = []
  const params = new URLSearchParams({ limit: String(50) })

  let next = apiUrl(`me/tracks?${params}`)

  // TODO: consider this more -- can we get all artists? cache them?
  // This only pulls the latest to avoid rate limiting, need to investigate more
  let limit = 5

  while (next && limit > 0) {
    /** @type Paged<SpotifySavedTrack> */
    const response = await get(next, token)
    console.log(response)

    const allArtists = response.items.map((item) => item.track.artists).flat()
    const nextArtists = allArtists.map(buildArtist)

    artists.push(...nextArtists)
    next = response.next
    limit = limit + -1
  }

  // Remove duplicate artists
  const uniqueArtists = [...new Set(artists)]

  return uniqueArtists
}

/**
 * Return an artist's albums
 *
 * @param {string} token
 * @param {string} artistId
 * @param {AlbumGroup[]} groups
 * @param {Market} market
 * @param {string} minDate
 * @returns {Promise<AlbumRaw[]>}
 */
export async function getArtistAlbums(token, artistId, groups, market, minDate) {
  /** @type {AlbumRaw[]} */
  const albums = []
  const params = new URLSearchParams({
    limit: String(50),
    include_groups: groups.join(','),
    market: market || DEFAULT_MARKET,
  })

  let next = apiUrl(`artists/${artistId}/albums?${params}`)

  while (next) {
    /** @type {Paged<SpotifyAlbum>} */
    const response = await get(next, token)
    const nextAlbums = response.items.map((album) => buildAlbumRaw(album, artistId))

    albums.push(...nextAlbums)

    if (!response.next) {
      return albums
    }

    next = last(albums).releaseDate < minDate ? null : response.next
  }

  const [lastGroup] = Object.keys(last(albums).artistIds)
  const restGroups = groups.slice(groups.indexOf(lastGroup) + 1)

  if (restGroups.length > 0) {
    const restAlbums = await getArtistAlbums(token, artistId, restGroups, market, minDate)

    albums.push(...restAlbums)
  }

  return albums
}

/**
 * Return an album's track IDs
 *
 * @param {string} token
 * @param {string[]} albumIds
 * @param {Market} [market]
 * @returns {Promise<string[]>}
 */
export async function getAlbumsTrackIds(token, albumIds, market) {
  /** @type {string[]} */
  const trackIds = []
  const params = new URLSearchParams({
    ids: albumIds.join(','),
    market: market || DEFAULT_MARKET,
  })

  /** @type {{ albums: Array<{ tracks: Paged<SpotifyTrack> }> }} */
  const response = await get(apiUrl(`albums?${params}`), token)

  for (const album of response.albums) {
    const albumTrackIds = album.tracks.items.map((track) => track.id)
    let next = album.tracks.next

    while (next) {
      /** @type {Paged<SpotifyTrack>} */
      const response = await get(next, token)
      const nextAlbumTrackIds = response.items.map((track) => track.id)

      albumTrackIds.push(...nextAlbumTrackIds)
      next = response.next
    }

    trackIds.push(...albumTrackIds)
  }

  return trackIds
}

/**
 * Create a new playlist
 *
 * @param {string} token
 * @param {string} userId
 * @param {string} name
 * @param {string} description
 * @param {boolean} isPrivate
 * @returns {Promise<SpotifyPlaylist>}
 */
export function createPlaylist(token, userId, name, description, isPrivate) {
  return post(apiUrl(`users/${userId}/playlists`), token, {
    name,
    description,
    public: !isPrivate,
  })
}

/**
 * Add tracks to an existing playlist
 *
 * @param {string} token
 * @param {string} playlistId
 * @param {string[]} trackUris
 * @returns {Promise<SpotifyPlaylistSnapshot>}
 */
export function addTracksToPlaylist(token, playlistId, trackUris) {
  return post(apiUrl(`playlists/${playlistId}/tracks`), token, { uris: trackUris })
}

/**
 * Create full API url
 *
 * @param {string} endpoint
 * @returns {string}
 */
function apiUrl(endpoint) {
  return `${API_URL}/${endpoint}`
}

/**
 * Fire GET request
 *
 * @param {string} endpoint
 * @param {string} token
 * @returns {Promise<any>}
 */
function get(endpoint, token) {
  return request(endpoint, token, 'GET')
}

/**
 * Fire POST request
 *
 * @param {string} endpoint
 * @param {string} token
 * @param {{ [prop: string]: any }} body
 * @returns {Promise<any>}
 */
function post(endpoint, token, body) {
  return request(
    endpoint,
    token,
    'POST',
    { 'content-type': 'application/json' },
    JSON.stringify(body)
  )
}

/**
 * Spotify API request wrapper
 *
 * @param {string} endpoint
 * @param {string} token
 * @param {string} method
 * @param {{ [prop: string]: any }} [headers]
 * @param {string} [body]
 * @returns {Promise<any>}
 */
async function request(endpoint, token, method, headers = {}, body) {
  const defaultHeaders = { authorization: `Bearer ${token}`, accept: 'application/json' }
  const response = await fetch(endpoint, {
    headers: { ...defaultHeaders, ...headers },
    method,
    body,
  })

  if (response.ok) {
    return response.json()
  }

  if (response.status === HTTP_TOO_MANY_REQUESTS) {
    const retryAfter = Number(response.headers.get('Retry-After'))
    await sleep((retryAfter + 1) * 1000)

    return request(endpoint, token, method, headers, body)
  }

  if (response.status >= 400 && response.status < 500) {
    const json = await response.json()

    throw new FetchError(response.status, response.statusText, json.error.message)
  }

  throw new FetchError(response.status, response.statusText)
}
