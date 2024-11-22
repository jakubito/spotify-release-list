import { buildUser, buildAlbumRaw, sleep } from 'helpers'

const API_URL = 'https://api.spotify.com/v1'
const HTTP_TOO_MANY_REQUESTS = 429

/**
 * Represents an error encountered during data fetching
 */
export class FetchError extends Error {
  /**
   * @param {number} status
   * @param {string} [message]
   */
  constructor(status, message) {
    super(message)
    this.name = 'FetchError'
    this.status = status
  }
}

/**
 * Return current user
 *
 * @param {string} token
 * @param {AbortSignal} [signal]
 */
export async function getUser(token, signal) {
  /** @type {SpotifyUser} */
  const userResponse = await get(apiUrl('me'), token, signal)
  return buildUser(userResponse)
}

/**
 * Return current user's followed artists page
 *
 * @type {CursorPagedRequest<SpotifyArtist>}
 */
export async function getUserFollowedArtistsPage(token, limit, after, signal) {
  const params = new URLSearchParams({ type: 'artist', limit: limit.toString() })
  if (after) params.set('after', after)
  /** @type {{ artists: CursorPaged<SpotifyArtist> }} */
  const response = await get(apiUrl(`me/following?${params}`), token, signal)
  return response.artists
}

/**
 * Return saved tracks page
 *
 * @type {PagedRequest<SpotifySavedTrack>}
 */
export function getUserSavedTracksPage(token, limit, offset, signal) {
  const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
  return get(apiUrl(`me/tracks?${params}`), token, signal)
}

/**
 * Return saved albums page
 *
 * @type {PagedRequest<SpotifySavedAlbum>}
 */
export function getUserSavedAlbumsPage(token, limit, offset, signal) {
  const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
  return get(apiUrl(`me/albums?${params}`), token, signal)
}

/**
 * Return saved playlists
 *
 * @type {PagedRequest<SpotifyPlaylist>}
 */
export function getUserSavedPlaylistsPage(token, limit, offset, signal) {
  const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() })
  return get(apiUrl(`me/playlists?${params}`), token, signal)
}

/**
 * Return an artist's albums
 *
 * @param {string} token
 * @param {string} artistId
 * @param {AlbumGroup[]} groups
 * @param {AbortSignal} [signal]
 */
export async function getArtistAlbums(token, artistId, groups, signal) {
  /** @type {AlbumRaw[]} */
  const albums = []
  const params = new URLSearchParams({ limit: '50', include_groups: groups.join(',') })
  let next = apiUrl(`artists/${artistId}/albums?${params}`)

  while (next) {
    /** @type {Paged<SpotifyAlbum>} */
    const response = await get(next, token, signal)
    for (const item of response.items) albums.push(buildAlbumRaw(item, artistId))
    next = response.next
  }

  return albums
}

/**
 * Return an album's track IDs
 *
 * @param {string} token
 * @param {string[]} albumIds
 * @param {AbortSignal} [signal]
 */
export async function getFullAlbums(token, albumIds, signal) {
  const params = new URLSearchParams({ ids: albumIds.join(',') })
  /** @type {{ albums: SpotifyAlbumFull[] }} */
  const response = await get(apiUrl(`albums?${params}`), token, signal)
  return response.albums
}

/**
 * Return an album's track IDs
 *
 * @param {string} token
 * @param {string[]} albumIds
 * @param {AbortSignal} [signal]
 */
export async function getAlbumsTrackIds(token, albumIds, signal) {
  /** @type {string[]} */
  const trackIds = []
  const albums = await getFullAlbums(token, albumIds, signal)

  for (const album of albums) {
    if (!album) continue

    const albumTrackIds = album.tracks.items.map((track) => track.id)
    let next = album.tracks.next

    while (next) {
      /** @type {Paged<SpotifyTrack>} */
      const response = await get(next, token, signal)
      for (const track of response.items) albumTrackIds.push(track.id)
      next = response.next
    }

    for (const id of albumTrackIds) trackIds.push(id)
  }

  return trackIds
}

/**
 * Create a new playlist
 *
 * @param {string} token
 * @param {string} userId
 * @param {PlaylistForm} form
 * @param {AbortSignal} [signal]
 * @returns {Promise<SpotifyPlaylist>}
 */
export function createPlaylist(token, userId, form, signal) {
  return post(
    apiUrl(`users/${userId}/playlists`),
    token,
    { name: form.name, description: form.description, public: !form.isPrivate },
    signal
  )
}

/**
 * Add tracks to an existing playlist
 *
 * @param {string} token
 * @param {string} playlistId
 * @param {string[]} trackUris
 * @param {AbortSignal} [signal]
 * @returns {Promise<SpotifyPlaylistSnapshot>}
 */
export function addTracksToPlaylist(token, playlistId, trackUris, signal) {
  return post(apiUrl(`playlists/${playlistId}/tracks`), token, { uris: trackUris }, signal)
}

/**
 * Clears all tracks from playlist
 *
 * @param {string} token
 * @param {string} playlistId
 * @param {AbortSignal} [signal]
 * @returns {Promise<SpotifyPlaylistSnapshot>}
 */
export function clearPlaylist(token, playlistId, signal) {
  return put(
    apiUrl(`playlists/${playlistId}/tracks`),
    token,
    { uris: [], range_start: 0, range_length: 99999 },
    signal
  )
}

/**
 * Create full API url
 *
 * @param {string} endpoint
 */
function apiUrl(endpoint) {
  return `${API_URL}/${endpoint}`
}

/**
 * Fire GET request
 *
 * @template T
 * @param {string} endpoint
 * @param {string} token
 * @param {AbortSignal} [signal]
 * @returns {Promise<T>}
 */
function get(endpoint, token, signal) {
  return request({ endpoint, token, signal, method: 'GET' })
}

/**
 * Fire POST request
 *
 * @template T
 * @param {string} endpoint
 * @param {string} token
 * @param {Record<string, unknown>} body
 * @param {AbortSignal} [signal]
 * @returns {Promise<T>}
 */
function post(endpoint, token, body, signal) {
  return request({
    endpoint,
    token,
    signal,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Fire PUT request
 *
 * @template T
 * @param {string} endpoint
 * @param {string} token
 * @param {Record<string, unknown>} body
 * @param {AbortSignal} [signal]
 * @returns {Promise<T>}
 */
function put(endpoint, token, body, signal) {
  return request({
    endpoint,
    token,
    signal,
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Spotify API request wrapper
 *
 * @template T
 * @param {{
 *   endpoint: string
 *   token: string
 *   method: import('workbox-routing/utils/constants').HTTPMethod
 *   headers?: Record<string, string>
 *   body?: string
 *   signal?: AbortSignal
 * }} payload
 * @returns {Promise<T>}
 */
async function request(payload) {
  const { endpoint, token, method, headers = {}, body, signal } = payload
  const defaultHeaders = { authorization: `Bearer ${token}`, accept: 'application/json' }

  const response = await fetch(endpoint, {
    headers: { ...defaultHeaders, ...headers },
    method,
    body,
    signal,
  })

  if (response.ok) return response.json()

  if (response.status === HTTP_TOO_MANY_REQUESTS) {
    const retryAfter = Number(response.headers.get('Retry-After'))
    await sleep((retryAfter + 1) * 1000)
    return request(payload)
  }

  let message = `HTTP Error ${response.status}`

  try {
    const json = await response.json()
    if (json.error?.message) message = json.error.message
  } catch {}

  throw new FetchError(response.status, message)
}
