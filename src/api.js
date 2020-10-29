import findLastIndex from 'lodash/findLastIndex'
import { buildUser, buildArtist, buildAlbum, sleep } from 'helpers'

/**
 * Return current user
 *
 * @param {string} token
 * @returns {Promise<User>}
 */
export async function getUser(token) {
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
  const artists = []
  const params = new URLSearchParams({ limit: String(50), type: 'artist' })

  let next = apiUrl(`me/following?${params}`)

  while (next) {
    const response = await get(next, token)
    const newArtists = response.artists.items.map(buildArtist)

    artists.push(...newArtists)
    next = response.artists.next
  }

  return artists
}

/**
 * Return artist's albums
 *
 * @param {string} token
 * @param {string} artistId
 * @param {AlbumGroup[]} groups
 * @param {Market} market
 * @param {string} minDate
 * @returns {Promise<Album[]>}
 */
export async function getArtistAlbums(token, artistId, groups, market, minDate) {
  if (groups.length === 0) {
    return []
  }

  const params = new URLSearchParams({
    limit: String(50),
    include_groups: groups.join(','),
    ...(market && { market }),
  })

  const url = apiUrl(`artists/${artistId}/albums?${params}`)
  const response = await get(url, token)
  const albums = []
  const groupCounts = new Map(groups.map((group) => [group, 0]))

  for (const album of response.items) {
    const albumGroup = album.album_group

    albums.push(buildAlbum(album, artistId))
    groupCounts.set(albumGroup, groupCounts.get(albumGroup) + 1)
  }

  if (!response.next) {
    return albums
  }

  const groupCountsValues = Array.from(groupCounts.values())
  const lastGroupIndex = findLastIndex(groupCountsValues)
  const [lastGroup, ...groupsRest] = groups.slice(lastGroupIndex)
  const lastAlbum = albums[albums.length - 1]
  const refetchLastGroup = lastGroupIndex > 0 && lastAlbum.releaseDate > minDate

  const restAlbums = await getArtistAlbums(
    token,
    artistId,
    refetchLastGroup ? [lastGroup, ...groupsRest] : groupsRest,
    market,
    minDate
  )

  return albums.concat(restAlbums)
}

/**
 * Return albums track IDs
 *
 * @param {string} token
 * @param {string[]} albumIds
 * @param {Market} [market]
 * @returns {Promise<string[]>}
 */
export async function getAlbumsTrackIds(token, albumIds, market) {
  const trackIds = []
  const params = new URLSearchParams({
    ids: albumIds.join(','),
    ...(market && { market }),
  })

  const response = await get(apiUrl(`albums?${params}`), token)

  for (const album of response.albums) {
    if (!album) {
      continue
    }

    const albumTrackIds = album.tracks.items.map((track) => track.id)
    let next = album.tracks.next

    while (next) {
      const response = await get(next, token)
      const newAlbumTrackIds = response.items.map((track) => track.id)

      albumTrackIds.push(...newAlbumTrackIds)
      next = response.next
    }

    trackIds.push(...albumTrackIds)
  }

  return trackIds
}

/**
 * Create new playlist
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
 * Add tracks to existing playlist
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
  return `https://api.spotify.com/v1/${endpoint}`
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
    { Accept: 'application/json', 'Content-Type': 'application/json' },
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
  const response = await fetch(endpoint, {
    method,
    body,
    headers: { ...headers, Authorization: `Bearer ${token}` },
  })

  if (response.ok) {
    return response.json()
  }

  // Handle 429 Too many requests
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('Retry-After'))

    // Add 1 extra second because Retry-After is not accurate
    await sleep((retryAfter + 1) * 1000)

    return request(endpoint, token, method, headers, body)
  }

  if (response.status >= 400 && response.status < 500) {
    const json = await response.json()

    throw new Error(`
      Fetch 4XX Response
      Status: ${response.status} ${response.statusText}
      Message: ${json.error.message}
    `)
  }

  throw new Error(`
    Fetch Error
    Status: ${response.status} ${response.statusText}
  `)
}
