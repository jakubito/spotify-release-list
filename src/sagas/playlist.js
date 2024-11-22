import { all, call, cancel, cancelled, fork, put, select } from 'redux-saga/effects'
import chunk from 'lodash/chunk'
import moment from 'moment'
import { spotifyUri } from 'helpers'
import { Scope, SpotifyEntity } from 'enums'
import {
  getAlbumsTrackIds,
  createPlaylist,
  addTracksToPlaylist,
  getUserSavedPlaylistsPage,
  clearPlaylist,
} from 'api'
import { getAuthData, getPlaylistScope } from 'auth'
import {
  getLastPlaylistsRefresh,
  getPlaylistForm,
  getPlaylists,
  getReleases,
  getUser,
} from 'state/selectors'
import {
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  loadPlaylists,
  loadPlaylistsError,
  loadPlaylistsFinished,
  loadPlaylistsStart,
  showErrorMessage,
  updatePlaylistError,
  updatePlaylistFinished,
  updatePlaylistStart,
} from 'state/actions'
import { authorize } from './auth'
import { withTitle } from './helpers'
import { getAllPaged, setupWorkers } from './request'

const { TRACK } = SpotifyEntity

/**
 * Playlist creation saga
 *
 * @param {CreatePlaylistAction} action
 */
export function* createPlaylistSaga(action) {
  const abortController = new AbortController()

  try {
    /** @type {ReturnType<typeof getPlaylistForm>} */
    const { isPrivate } = yield select(getPlaylistForm)
    /** @type {ReturnType<typeof getPlaylistScope>} */
    const scope = yield call(getPlaylistScope, isPrivate)

    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(
      withTitle,
      'Creating playlist...',
      createPlaylistMainSaga,
      abortController.signal
    )
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [scope], titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(createPlaylistError())
  } finally {
    if (yield cancelled()) abortController.abort()
  }
}

/**
 * Playlist creation main saga
 *
 * @param {AbortSignal} signal
 */
function* createPlaylistMainSaga(signal) {
  yield put(createPlaylistStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<typeof getPlaylistForm>} */
  const form = yield select(getPlaylistForm)
  /** @type {GeneratorReturnType<ReturnType<typeof getReleasesTrackUris>>} */
  const trackUris = yield call(getReleasesTrackUris, signal)

  /** @type {SpotifyPlaylist} */
  let firstPlaylist

  for (const [part, playlistTrackUrisChunk] of chunk(trackUris, 9500).entries()) {
    const name = part > 0 ? `${form.name} (${part + 1})` : form.name
    /** @type {Await<ReturnType<typeof createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, { ...form, name }, signal)

    if (!firstPlaylist) firstPlaylist = playlist

    for (const trackUrisChunk of chunk(playlistTrackUrisChunk, 100)) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk, signal)
    }
  }

  yield put(createPlaylistFinished({ id: firstPlaylist.id, name: firstPlaylist.name }))
}

/**
 * @param {UpdatePlaylistAction} action
 */
export function* updatePlaylistSaga(action) {
  const abortController = new AbortController()

  try {
    /** @type {Scope[]} */
    const scopes = [Scope.PLAYLIST_MODIFY_PRIVATE, Scope.PLAYLIST_MODIFY_PUBLIC]

    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(
      withTitle,
      'Updating playlist...',
      updatePlaylistMainSaga,
      action,
      abortController.signal
    )
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, scopes, titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(updatePlaylistError())
  } finally {
    if (yield cancelled()) abortController.abort()
  }
}

/**
 * @param {UpdatePlaylistAction} action
 * @param {AbortSignal} signal
 */
function* updatePlaylistMainSaga(action, signal) {
  yield put(updatePlaylistStart())

  const { playlist, strategy } = action.payload
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {GeneratorReturnType<ReturnType<typeof getReleasesTrackUris>>} */
  const trackUris = yield call(getReleasesTrackUris, signal)

  if (strategy === 'replace') {
    yield call(clearPlaylist, token, playlist.id, signal)
  }

  for (const trackUrisChunk of chunk(trackUris, 100)) {
    yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk, signal)
  }

  yield put(updatePlaylistFinished(playlist))
}

/**
 * @param {AbortSignal} signal
 */
function* getReleasesTrackUris(signal) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getReleases>} */
  const releases = yield select(getReleases)

  const albumIds = releases.reduce(
    (ids, { albums }) => ids.concat(albums.map((album) => album.id)),
    /** @type {string[]} */ ([])
  )

  const trackIdsCalls = chunk(albumIds, 20).map((albumIdsChunk) =>
    call(getAlbumsTrackIds, token, albumIdsChunk, signal)
  )

  /** @type {Await<ReturnType<typeof getAlbumsTrackIds>>[]} */
  const trackIds = yield all(trackIdsCalls)
  const trackUris = trackIds.flat().map((trackId) => spotifyUri(trackId, TRACK))

  return trackUris
}

export function* refreshPlaylistsSaga() {
  /** @type {ReturnType<typeof getPlaylists>} */
  const playlists = yield select(getPlaylists)
  /** @type {ReturnType<typeof getLastPlaylistsRefresh>} */
  const lastRefresh = yield select(getLastPlaylistsRefresh)

  const shouldRefresh = () => {
    if (playlists.length === 0) return true
    if (!lastRefresh) return true
    if (moment(lastRefresh).isBefore(moment().subtract(1, 'hour'))) return true
    return false
  }

  if (shouldRefresh()) yield put(loadPlaylists())
}

/**
 * @param {LoadPlaylistsAction} action
 */
export function* loadPlaylistsSaga(action) {
  try {
    /** @type {Scope[]} */
    const scopes = [Scope.PLAYLIST_READ_PRIVATE]

    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, scopes, loadPlaylistsMainSaga)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(loadPlaylistsError())
  }
}

function* loadPlaylistsMainSaga() {
  yield put(loadPlaylistsStart())

  /** @type {RequestWorkers} */
  const { workers, requestChannel, responseChannel, workersFork } = yield call(setupWorkers)
  yield fork(workersFork)

  /** @type {Playlist[]} */
  const playlists = yield call(
    getUserSavedPlaylists,
    requestChannel,
    responseChannel,
    workers.length
  )

  yield cancel(workers)
  yield put(loadPlaylistsFinished(playlists))
}

/**
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {number} workersCount
 */
function* getUserSavedPlaylists(requestChannel, responseChannel, workersCount) {
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)

  /** @type {SpotifyPlaylist[]} */
  const spotifyPlaylists = yield call(
    getAllPaged,
    getUserSavedPlaylistsPage,
    requestChannel,
    responseChannel,
    workersCount
  )

  /** @type {Playlist[]} */
  const playlists = []
  /** @type {Set<string>} */
  const ids = new Set()

  for (const playlist of spotifyPlaylists) {
    if (playlist.owner.id !== user.id) continue
    if (ids.has(playlist.id)) continue

    playlists.push({ id: playlist.id, name: playlist.name })
    ids.add(playlist.id)
  }

  return playlists
}
