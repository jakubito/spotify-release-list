import orderBy from 'lodash/orderBy'
import { MomentFormat } from 'enums'

const ALPHA_NUMERIC = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Promisified setTimeout
 *
 * @param {number} ms
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Delay function executions
 *
 * @param {function} fn
 * @param {number} ms
 * @param {...any} [args] - Arguments to be passed to function
 * @returns {void}
 */
export function delay(fn, ms, ...args) {
  setTimeout(() => fn(...args), ms)
}

/**
 * Delay function execution until UI is done updating
 *
 * @param {function} fn
 * @param {...any} [args] - Arguments to be passed to function
 * @returns {void}
 */
export function defer(fn, ...args) {
  requestAnimationFrame(() => delay(fn, 0, ...args))
}

/**
 * Split array into chunks
 *
 * @param {any[]} inputArray
 * @param {number} chunkSize
 * @returns {any[][]}
 */
export function chunks(inputArray, chunkSize) {
  const input = [...inputArray]
  const result = []

  while (input.length > 0) {
    result.push(input.splice(0, chunkSize))
  }

  return result
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
 * Toggle value in set
 *
 * @template {Set} S
 * @param {S} set
 * @param {any} value
 * @returns {S}
 */
export function toggleSetValue(set, value) {
  if (set.has(value)) {
    set.delete(value)
  } else {
    set.add(value)
  }

  return set
}

/**
 * Get playlist name suggestion
 *
 * @param {Moment} [startDate]
 * @param {Moment} [endDate]
 * @returns {string|null}
 */
export function getPlaylistNameSuggestion(startDate, endDate) {
  if (!startDate || !endDate) {
    return null
  }

  const startDateFormatted = startDate.format('MMM D')
  const endDateFormatted = endDate.format('MMM D')

  if (startDateFormatted === endDateFormatted) {
    return `${startDateFormatted} Releases`
  }

  return `${startDateFormatted} - ${endDateFormatted} Releases`
}

/**
 * Get release IDs released between startDate and endDate
 *
 * @param {Object} [releasesMap] - Releases map from redux store
 * @param {Moment} [startDate]
 * @param {Moment} [endDate]
 * @returns {string[]|null}
 */
export function getReleasesByDate(releasesMap, startDate, endDate) {
  if (!releasesMap || !startDate || !endDate) {
    return null
  }

  const filteredReleases = []
  const current = endDate.clone()

  while (current.isSameOrAfter(startDate)) {
    const currentFormatted = current.format(MomentFormat.ISO_DATE)

    if (releasesMap[currentFormatted]) {
      const currentReleases = orderBy(releasesMap[currentFormatted], 'name')
      const currentReleasesIds = currentReleases.map(({ id }) => id)

      filteredReleases.push(...currentReleasesIds)
    }

    current.subtract(1, 'day')
  }

  return filteredReleases
}

/**
 * Create Spotify URI
 *
 * @param {string} id
 * @param {string} entity
 * @returns {string}
 */
export function getSpotifyUri(id, entity) {
  return `spotify:${entity}:${id}`
}

/**
 * Create Spotify URL
 *
 * @param {string} id
 * @param {string} entity
 * @returns {string}
 */
export function getSpotifyUrl(id, entity) {
  return `https://open.spotify.com/${entity}/${id}`
}

/**
 * Pick image from array of images and return its URL
 *
 * @param {SpotifyImage[]} [images]
 * @returns {string|null}
 */
export function getImage(images) {
  if (!images || !images.length) {
    return null
  }

  for (const image of images) {
    if (image.width === 300) {
      return image.url
    }
  }

  return images[0].url
}

/**
 * Create user object
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
 * Create artist object
 *
 * @param {SpotifyArtist} source
 * @returns {Artist}
 */
export function buildArtist(source) {
  return {
    id: source.id,
    name: source.name,
  }
}

/**
 * Create album object
 *
 * @param {SpotifyAlbum} source
 * @param {string} artistId
 * @returns {Album}
 */
export function buildAlbum(source, artistId) {
  return {
    id: source.id,
    name: source.name,
    image: getImage(source.images),
    artists: source.artists.map(buildArtist),
    releaseDate: source.release_date,
    artistId,
  }
}
