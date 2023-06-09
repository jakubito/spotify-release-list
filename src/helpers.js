import moment from 'moment'
import orderBy from 'lodash/orderBy'
import mergeWith from 'lodash/mergeWith'
import random from 'lodash/random'
import { colord } from 'colord'
import * as Sentry from '@sentry/browser'
import { AlbumGroup, AlbumGroupIndex, MomentFormat, ReleasesOrder } from 'enums'

const { ISO_DATE } = MomentFormat
const NOTIFICATION_ICON = `${process.env.REACT_APP_URL}/android-chrome-192x192.png`
const VARIOUS_ARTISTS = 'Various Artist'
const VARIOUS_ARTISTS_ID = '0LyfQWJT6nXafLPZqxe9Of'

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
 * Callback wrapper for `defer()`
 *
 * @param {function} fn
 * @param {...any} [args] - Arguments to be passed to function
 * @returns {() => void}
 */
export function deferred(fn, ...args) {
  return () => defer(fn, ...args)
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
 * @param {Moment} [startDate]
 * @param {Moment} [endDate]
 * @returns {string|null}
 */
export function playlistName(startDate, endDate) {
  if (!startDate || !endDate) return 'New Releases'

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
 * Create Spotify link
 *
 * @param {string} id
 * @param {string} entity
 * @param {boolean} [uri] - Return URI link if `true`
 * @returns {string}
 */
export function spotifyLink(id, entity, uri = false) {
  return uri ? spotifyUri(id, entity) : spotifyUrl(id, entity)
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
    totalTracks: source.total_tracks,
  }
}

/**
 * Generate random color scheme
 *
 * @param {{ rotation: () => number, saturation: () => number, lightness: () => number }} options
 * @returns {GroupColorScheme}
 */
export function randomColorScheme({ rotation, saturation, lightness }) {
  let hue = random(0, 359)

  const scheme = Object.values(AlbumGroup).reduce((scheme, group) => {
    hue += rotation()

    if (hue >= 360) {
      hue -= 360
    }

    scheme[group] = colord({ h: hue, s: saturation(), l: lightness() }).toHex()

    return scheme
  }, /** @type {GroupColorScheme} */ ({}))

  return scheme
}

/**
 * Create new notification
 *
 * @param {string} title
 * @param {string} [body]
 * @returns {Notification}
 */
export function createNotification(title, body) {
  const notification = new Notification(title, { body, icon: NOTIFICATION_ICON })

  notification.addEventListener('click', () => {
    window.focus()
    notification.close()
  })

  return notification
}

/**
 * Check if all modals are closed
 *
 * @returns {boolean}
 */
export function modalsClosed() {
  return !document.documentElement.classList.contains('is-modal-open')
}

/**
 * Sentry captureException wrapper
 *
 * @param {Error & { contexts?: SentryContexts }} error
 */
export function captureException(error) {
  console.error(error)
  Sentry.captureException(error, { contexts: error.contexts })
}

/**
 * Merge album artists and filter out old albums
 *
 * @param {AlbumRaw[]} albumsRaw
 * @param {string} minDate
 * @returns {AlbumRaw[]}
 */
export function mergeAlbumsRaw(albumsRaw, minDate) {
  const maxDate = moment().add(1, 'day').format(MomentFormat.ISO_DATE)
  const albumsRawMap = albumsRaw.reduce((map, album) => {
    if (album.releaseDate < minDate || album.releaseDate > maxDate) {
      return map
    }

    const matched = map[album.id]

    if (!matched) {
      map[album.id] = album
      return map
    }

    merge(matched.artistIds, album.artistIds)
    return map
  }, /** @type {{ [id: string]: AlbumRaw }} */ ({}))

  return Object.values(albumsRawMap)
}

/**
 * Build AlbumsMap
 *
 * @param {AlbumRaw[]} albumsRaw
 * @param {Artist[]} artists
 * @returns {AlbumsMap}
 */
export function buildAlbumsMap(albumsRaw, artists) {
  const artistsMap = artists.reduce((map, artist) => {
    map[artist.id] = artist
    return map
  }, /** @type {ArtistsMap} */ ({}))

  const albumsMap = albumsRaw.reduce((map, albumRaw) => {
    map[albumRaw.id] = buildAlbum(albumRaw, artistsMap)
    return map
  }, /** @type {AlbumsMap} */ ({}))

  return albumsMap
}

/**
 * Build Album
 *
 * @param {AlbumRaw} albumRaw
 * @param {ArtistsMap} artistsMap
 * @returns {Album}
 */
export function buildAlbum(albumRaw, artistsMap) {
  const { artistIds, albumArtists, ...albumBase } = albumRaw

  const artistIdsArray = Object.values(artistIds).flat()
  const artistIdsEntries = orderBy(Object.entries(artistIds), ([group]) => AlbumGroupIndex[group])
  const artistsEntries = artistIdsEntries.map(([group, artistIds]) => {
    const artists = orderBy(
      artistIds.map((id) => artistsMap[id]),
      'name'
    )

    return /** @type {[group: AlbumGroup, artists: Artist[]]} */ ([group, artists])
  })

  const artists = Object.fromEntries(artistsEntries)
  const otherArtists = albumArtists.filter((artist) => !artistIdsArray.includes(artist.id))

  return { ...albumBase, artists, otherArtists }
}

/**
 * Build ReleasesMap
 *
 * @param {Album[]} albums
 * @returns {ReleasesMap}
 */
export function buildReleasesMap(albums) {
  return albums.reduce(
    (map, album) => merge(map, { [album.releaseDate]: [album] }),
    /** @type {ReleasesMap} */ ({})
  )
}

/**
 * Build Releases
 *
 * @param {ReleasesMap} releasesMap
 * @param {ReleasesOrder} releasesOrder
 * @returns {Releases}
 */
export function buildReleases(releasesMap, releasesOrder) {
  const releasesUnordered = Object.entries(releasesMap).map(([date, albums]) => ({ date, albums }))
  const releasesOrderedByDate = orderBy(releasesUnordered, 'date', 'desc')

  const releases = releasesOrderedByDate.map((releaseDay) => {
    /** @param {Album} album */
    const orderByAlbumGroup = (album) => AlbumGroupIndex[Object.keys(album.artists).shift()]
    /** @param {Album} album */
    const orderByArtistName = (album) =>
      Object.values(album.artists).flat().shift().name.toLowerCase()

    /** @type {Array<((album: Album) => string | number) | string>} */
    const orders = [orderByArtistName, 'name']
    if (releasesOrder === ReleasesOrder.ALBUM_GROUP) orders.unshift(orderByAlbumGroup)

    releaseDay.albums = orderBy(releaseDay.albums, orders)

    return releaseDay
  })

  return releases
}

/**
 * Check if album contains Various Artists
 *
 * @param {Album} album
 * @returns {boolean}
 */
export function hasVariousArtists(album) {
  return Object.values(album.artists)
    .flat()
    .concat(album.otherArtists)
    .some((artist) => artist.name === VARIOUS_ARTISTS || artist.id === VARIOUS_ARTISTS_ID)
}

/**
 * Delete albums from specified labels and return deleted IDs. Mutates `albumsMap`.
 *
 * @param {AlbumsMap | Draft<AlbumsMap>} albumsMap
 * @param {string} labelsList
 * @returns {string[]}
 */
export function deleteLabels(albumsMap, labelsList) {
  if (labelsList.trim().length === 0) return []

  /** @type {string[]} */
  const ids = []
  /** @type {Record<string, string[]>} */
  const labels = {}
  const entries = labelsList.matchAll(/^\s*(?:\*(\S*)\*)?\s*(.*?)\s*$/gm)

  for (const [, flags, label] of entries) {
    labels[label] = flags?.split(',')
  }

  /** @param {Album} album */
  function shouldDelete(album) {
    if (album.label in labels) {
      if (labels[album.label] === undefined) return true
      if (labels[album.label].includes('VA') && hasVariousArtists(album)) return true
    }

    return false
  }

  for (const album of Object.values(albumsMap)) {
    if (shouldDelete(album)) {
      ids.push(album.id)
      delete albumsMap[album.id]
    }
  }

  return ids
}

/**
 * Calculate approximate page size based on viewport size
 *
 * @param {number} width
 * @param {number} height
 */
export function calculatePageSize(width, height) {
  const estimate = Math.round((width * height) / 20_000)
  return Math.max(20, Math.min(100, estimate))
}
