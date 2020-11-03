import orderBy from 'lodash/orderBy'

/**
 * @param {State} state
 * @param {{ albums: Album[], artists: Artist[], minDate: string }} payload
 * @returns {State}
 */
export function setAlbums(state, payload) {
  const artists = payload.artists.reduce(
    (map, artist) => ({
      ...map,
      [artist.id]: artist,
    }),
    {}
  )

  const albums = payload.albums.reduce(
    /** @param {typeof state.albums} map */
    (map, album) => {
      if (album.releaseDate < payload.minDate) {
        return map
      }

      const { artistId, ...albumRest } = album
      const matched = map[album.id]

      if (!matched) {
        /** @type {AlbumGrouped} */
        const newAlbum = {
          ...albumRest,
          artists: orderBy(albumRest.artists, 'name').filter((artist) => artist.id !== artistId),
          primaryArtists: [artists[artistId]],
        }

        map[album.id] = newAlbum

        return map
      }

      const inPrimary = matched.primaryArtists.find((artist) => artist.id === artistId)

      if (!inPrimary) {
        matched.artists = matched.artists.filter((artist) => artist.id !== artistId)
        matched.primaryArtists = orderBy([...matched.primaryArtists, artists[artistId]], 'name')
      }

      return map
    },
    {}
  )

  return { ...state, albums }
}
