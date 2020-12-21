import { all, call, put, select } from 'redux-saga/effects'
import { chunks, spotifyUri } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getAlbumsTrackIds, createPlaylist, addTracksToPlaylist } from 'api'
import { isValidPlaylistToken, startPlaylistAuthFlow } from 'auth'
import {
  getPlaylistForm,
  getReleasesEntries,
  getSettings,
  getToken,
  getUser,
} from 'state/selectors'
import {
  createPlaylistStart,
  createPlaylistFinished,
  createPlaylistError,
  showErrorMessage,
} from 'state/actions'
import { withValidToken } from './helpers'

const { TRACK } = SpotifyEntity

/**
 * Playlist creation wrapper saga
 */
function* createPlaylistSaga() {
  try {
    /** @type {ReturnType<typeof getPlaylistForm>} */
    const { isPrivate } = yield select(getPlaylistForm)

    yield call(
      withValidToken,
      createPlaylistMainSaga,
      isValidPlaylistToken,
      startPlaylistAuthFlow,
      isPrivate
    )
  } catch (error) {
    yield put(showErrorMessage())
    yield put(createPlaylistError())

    throw error
  }
}

/**
 * Playlist creation main saga
 */
function* createPlaylistMainSaga() {
  yield put(createPlaylistStart())

  /** @type {ReturnType<typeof getToken>} */
  const token = yield select(getToken)
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<typeof getPlaylistForm>} */
  const { name, description, isPrivate } = yield select(getPlaylistForm)
  /** @type {ReturnType<typeof getSettings>} */
  const { market } = yield select(getSettings)
  /** @type {ReturnType<typeof getReleasesEntries>} */
  const releases = yield select(getReleasesEntries)

  const albumIds = releases.reduce(
    (ids, [, albums]) => [...ids, ...albums.map((album) => album.id)],
    /** @type {string[]} */ ([])
  )

  const trackIdsCalls = chunks(albumIds, 20).map((albumIdsChunk) =>
    call(getAlbumsTrackIds, token, albumIdsChunk, market)
  )

  /** @type {Await<ReturnType<typeof getAlbumsTrackIds>>[]} */
  const trackIds = yield all(trackIdsCalls)
  const trackUris = trackIds.flat().map((trackId) => spotifyUri(trackId, TRACK))
  /** @type {SpotifyPlaylist} */
  let firstPlaylist

  for (const [part, playlistTrackUrisChunk] of chunks(trackUris, 9500).entries()) {
    const fullName = part > 0 ? `${name} (${part + 1})` : name
    /** @type {Await<ReturnType<typeof createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, fullName, description, isPrivate)

    if (!firstPlaylist) {
      firstPlaylist = playlist
    }

    for (const trackUrisChunk of chunks(playlistTrackUrisChunk, 100)) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk)
    }
  }

  yield put(createPlaylistFinished(firstPlaylist.id))
}

export default createPlaylistSaga
