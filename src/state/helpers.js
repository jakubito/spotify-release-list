import moment from 'moment'
import orderBy from 'lodash/orderBy'
import { AlbumGroupIndex, MomentFormat } from 'enums'
import { merge } from 'helpers'

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
 * @returns {Releases}
 */
export function buildReleases(releasesMap) {
  const releasesUnordered = Object.entries(releasesMap).map(([date, albums]) => ({ date, albums }))
  const releasesOrderedByDate = orderBy(releasesUnordered, 'date', 'desc')
  const releases = releasesOrderedByDate.map((releaseDay) => {
    releaseDay.albums = orderBy(releaseDay.albums, [
      (album) => Object.values(album.artists).flat().shift().name.toLowerCase(),
      'name',
    ])
    return releaseDay
  })

  return releases
}
