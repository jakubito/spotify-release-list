import mergeWith from 'lodash/mergeWith'
import { MomentFormat } from 'enums'

const { ISO_DATE } = MomentFormat
const ALPHA_NUMERIC = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Promisified setTimeout
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Delay function execution until UI is done updating
 *
 * @param {function} fn
 * @param {...any} [args] - Arguments to be passed to function
 * @returns {void}
 */
export function defer(fn, ...args) {
  requestAnimationFrame(() => setTimeout(() => fn(...args), 0))
}

/**
 * Split array into chunks
 *
 * @template T
 * @param {T[]} inputArray
 * @param {number} chunkSize
 * @returns {T[][]}
 */
export function chunks(inputArray, chunkSize) {
  const input = [...inputArray]
  /** @type {T[][]} */
  const result = []

  while (input.length > 0) {
    result.push(input.splice(0, chunkSize))
  }

  return result
}

/**
 * Wrapper around lodash `mergeWith` that concatenates array values
 *
 * @template {Object} T
 * @param {T} object
 * @param {Object} source
 * @returns {T}
 */
export function merge(object, source) {
  return mergeWith(object, source, (objValue, srcValue) =>
    Array.isArray(objValue) ? objValue.concat(srcValue) : undefined
  )
}

/**
 * Pick random character from input string
 *
 * @param {string} input
 * @returns {string}
 */
function pickRandom(input) {
  return input[Math.floor(Math.random() * input.length)]
}

/**
 * Generate random nonce
 *
 * @returns {string}
 */
export function generateNonce() {
  return Array.from(Array(20), () => pickRandom(ALPHA_NUMERIC)).join('')
}

/**
 * Check if value is string
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value) {
  return typeof value === 'string'
}

/**
 * Check if array includes truthy value
 *
 * @param {any[]} array
 * @returns {boolean}
 */
export function includesTruthy(array) {
  return array.some((value) => value)
}

/**
 * Get dates between `startDate` and `endDate`
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @yields {string}
 */
export function* dateRange(startDate, endDate) {
  const current = startDate.clone()

  while (current.isSameOrBefore(endDate)) {
    yield current.format(ISO_DATE)

    current.add(1, 'day')
  }
}

/**
 * Create playlist name suggestion
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @returns {string|null}
 */
export function playlistName(startDate, endDate) {
  const start = startDate.format('MMM D')
  const end = endDate.format('MMM D')

  if (startDate.isSame(endDate, 'day')) {
    return `${start} Releases`
  }

  return `${start} - ${end} Releases`
}

/**
 * Get release IDs released between startDate and endDate
 *
 * @param {ReleasesMap} releasesMap
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @returns {string[]}
 */
export function getReleasesBetween(releasesMap, startDate, endDate) {
  /** @type {string[]} */
  const releases = []

  for (const date of dateRange(startDate, endDate)) {
    if (releasesMap[date]) {
      releases.push(...releasesMap[date].map(({ id }) => id))
    }
  }

  return releases
}

/**
 * Create Spotify URI
 *
 * @param {string} id
 * @param {string} entity
 * @returns {string}
 */
export function spotifyUri(id, entity) {
  return `spotify:${entity}:${id}`
}

/**
 * Create Spotify URL
 *
 * @param {string} id
 * @param {string} entity
 * @returns {string}
 */
export function spotifyUrl(id, entity) {
  return `https://open.spotify.com/${entity}/${id}`
}

/**
 * Pick image from array of images and return its URL
 *
 * @param {SpotifyImage[]} [images]
 * @returns {string|null}
 */
export function getImage(images) {
  if (!images?.length) {
    return null
  }

  const image = images.find(({ width }) => width === 300)

  return image ? image.url : images[0].url
}

/**
 * Build User
 *
 * @param {SpotifyUser} source
 * @returns {User}
 */
export function buildUser(source) {
  return {
    id: source.id,
    name: source.display_name,
    image: getImage(source.images),
  }
}

/**
 * Build Artist
 *
 * @param {SpotifyArtist} source
 * @returns {Artist}
 */
export function buildArtist(source) {
  return { id: source.id, name: source.name }
}

/**
 * Build AlbumRaw
 *
 * @param {SpotifyAlbum} source
 * @param {string} artistId
 * @returns {AlbumRaw}
 */
export function buildAlbumRaw(source, artistId) {
  return {
    id: source.id,
    name: source.name,
    image: getImage(source.images),
    albumArtists: source.artists.map(buildArtist),
    releaseDate: source.release_date,
    artistIds: { [source.album_group]: [artistId] },
  }
}
