import { download, sanitizeCsvValue } from 'helpers'
import { call, select } from 'redux-saga/effects'
import { getReleases } from 'state/selectors'

export function* downloadAlbumsCsvSaga() {
  /** @type {ReturnType<typeof getReleases>} */
  const releases = yield select(getReleases)
  let content = ''

  /** @param {string[]} data */
  const addRow = (data) => {
    content += data.map(sanitizeCsvValue).join(',')
    content += `\r\n`
  }

  addRow(['Date', 'ID', 'Title', 'Type', 'Artists', 'Other artists', 'Label'])

  for (const { albums } of releases) {
    for (const album of albums) {
      const artists = Object.values(album.artists)
        .flat()
        .map((artist) => artist.name)
      const otherArtists = album.otherArtists.map((artist) => artist.name)

      addRow([
        album.releaseDate,
        album.id,
        album.name,
        Object.keys(album.artists).join(','),
        artists.join(','),
        otherArtists.join(','),
        album.label,
      ])
    }
  }

  const blob = new Blob([content], { type: 'text/csv' })
  yield call(download, blob, 'releases.csv')
}
