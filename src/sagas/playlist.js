import { all, call, put, select } from 'redux-saga/effects'
import chunk from 'lodash/chunk'
import { spotifyUri } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getAlbumsTrackIds, createPlaylist, addTracksToPlaylist } from 'api'
import { getAuthData, getPlaylistScope } from 'auth'
import { getPlaylistForm, getReleases, getUser } from 'state/selectors'
import {
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  showErrorMessage,
} from 'state/actions'
import { authorize } from './auth'
import { withTitle } from './helpers'

const { TRACK } = SpotifyEntity

/**
 * Playlist creation saga
 *
 * @param {CreatePlaylistAction} action
 */
export function* createPlaylistSaga(action) {
  try {
    /** @type {ReturnType<typeof getPlaylistForm>} */
    const { isPrivate } = yield select(getPlaylistForm)
    /** @type {ReturnType<typeof getPlaylistScope>} */
    const scope = yield call(getPlaylistScope, isPrivate)

    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Creating playlist...', createPlaylistMainSaga)
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [scope], titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(createPlaylistError())
  }
}

/**
 * Playlist creation main saga
 */
function* createPlaylistMainSaga() {
  yield put(createPlaylistStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<typeof getPlaylistForm>} */
  const { name, description, isPrivate } = yield select(getPlaylistForm)
  /** @type {ReturnType<typeof getReleases>} */
  const releases = yield select(getReleases)

  const albumIds = releases.reduce(
    (ids, { albums }) => ids.concat(albums.map((album) => album.id)),
    /** @type {string[]} */ ([])
  )

  const trackIdsCalls = chunk(albumIds, 20).map((albumIdsChunk) =>
    call(getAlbumsTrackIds, token, albumIdsChunk)
  )

  /** @type {Await<ReturnType<typeof getAlbumsTrackIds>>[]} */
  const trackIds = yield all(trackIdsCalls)
  const trackUris = trackIds.flat().map((trackId) => spotifyUri(trackId, TRACK))
  /** @type {SpotifyPlaylist} */
  let firstPlaylist

  for (const [part, playlistTrackUrisChunk] of chunk(trackUris, 9500).entries()) {
    const fullName = part > 0 ? `${name} (${part + 1})` : name
    /** @type {Await<ReturnType<typeof createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, fullName, description, isPrivate)

    if (!firstPlaylist) {
      firstPlaylist = playlist
    }

    for (const trackUrisChunk of chunk(playlistTrackUrisChunk, 100)) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk)
    }
  }

  yield put(createPlaylistFinished({ id: firstPlaylist.id }))
}
