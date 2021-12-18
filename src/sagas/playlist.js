import { all, call, put, select } from 'redux-saga/effects'
import chunk from 'lodash/chunk'
import { getPlaylistScopes, spotifyUri } from 'helpers'
import { Scope, SpotifyEntity } from 'enums'
import { getAlbumsTrackIds, createPlaylist, addTracksToPlaylist } from 'api'
import { AuthError, getAuthData } from 'auth'
import { getPlaylistForm, getReleases, getSettings, getUser } from 'state/selectors'
import {
  createPlaylistStart,
  createPlaylistFinished,
  createPlaylistError,
  showErrorMessage,
} from 'state/actions'
import { authorize } from './auth'
import { withTitle } from './helpers'

const { USER_FOLLOW_READ, PLAYLIST_MODIFY_PRIVATE, USER_LIBRARY_READ, PLAYLIST_MODIFY_PUBLIC } =
  Scope
const { TRACK } = SpotifyEntity

/**
 * Playlist creation saga
 *
 * @param {CreatePlaylistAction} action
 */
export function* createPlaylistSaga(action) {
  try {
    /** @type {ReturnType<getPlaylistForm>} */
    const playlistForm = yield select(getPlaylistForm)

    const scopes = getPlaylistScopes(playlistForm)

    /** @type {ReturnType<withTitle>} */
    const titled = yield call(withTitle, 'Creating playlist...', createPlaylistMainSaga)
    /** @type {ReturnType<authorize>} */
    const authorized = yield call(authorize, action, scopes, titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    yield put(createPlaylistError())
  }
}

/**
 * Playlist creation main saga
 */
function* createPlaylistMainSaga() {
  yield put(createPlaylistStart())

  /** @type {ReturnType<getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<getPlaylistForm>} */
  const { name, description, isPrivate } = yield select(getPlaylistForm)
  /** @type {ReturnType<getSettings>} */
  const { market } = yield select(getSettings)
  /** @type {ReturnType<getReleases>} */
  const releases = yield select(getReleases)

  const albumIds = releases.reduce(
    (ids, { albums }) => ids.concat(albums.map((album) => album.id)),
    /** @type {string[]} */ ([])
  )

  const trackIdsCalls = chunk(albumIds, 20).map((albumIdsChunk) =>
    call(getAlbumsTrackIds, token, albumIdsChunk, market)
  )

  /** @type {Await<ReturnType<getAlbumsTrackIds>>[]} */
  const trackIds = yield all(trackIdsCalls)
  const trackUris = trackIds.flat().map((trackId) => spotifyUri(trackId, TRACK))
  /** @type {SpotifyPlaylist} */
  let firstPlaylist

  for (const [part, playlistTrackUrisChunk] of chunk(trackUris, 9500).entries()) {
    const fullName = part > 0 ? `${name} (${part + 1})` : name
    /** @type {Await<ReturnType<createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, fullName, description, isPrivate)

    if (!firstPlaylist) {
      firstPlaylist = playlist
    }

    for (const trackUrisChunk of chunk(playlistTrackUrisChunk, 100)) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk)
    }
  }

  yield put(createPlaylistFinished(firstPlaylist.id))
}
