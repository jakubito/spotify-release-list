import { call, put, takeLeading, select, fork, cancel } from 'redux-saga/effects'
import chunk from 'lodash/chunk'
import { Scope } from 'enums'
import { searchAlbumsByLabel, getAlbumsTrackIds, createPlaylist, addTracksToPlaylist } from 'api'
import { getAuthData } from 'auth'
import { spotifyUri } from 'helpers'
import { SpotifyEntity } from 'enums'
import {
  searchLabel,
  searchLabelStart,
  searchLabelFinished,
  searchLabelError,
  createLabelPlaylist,
  createLabelPlaylistStart,
  createLabelPlaylistFinished,
  createLabelPlaylistError,
  createLabelPlaylistCancel,
  showErrorMessage,
} from 'state/actions'
import {
  getLabelSelectedReleases,
  getLabelPlaylistForm,
  getUser,
} from 'state/selectors'
import { authorize } from './auth'
import { withTitle, takeLeadingCancellable } from './helpers'
import { setupWorkers } from './request'

const { TRACK } = SpotifyEntity

/**
 * Main label explorer saga
 */
export function* labelExplorerSaga() {
  yield takeLeading(searchLabel.type, searchLabelSaga)
  yield takeLeadingCancellable(createLabelPlaylist.type, createLabelPlaylistCancel.type, createLabelPlaylistSaga)
}

/**
 * Search for albums by label
 *
 * @param {ReturnType<typeof searchLabel>} action
 */
function* searchLabelSaga(action) {
  try {
    yield put(searchLabelStart())
    
    /** @type {ReturnType<typeof getAuthData>} */
    const { token } = yield call(getAuthData)
    
    /** @type {Await<ReturnType<typeof searchAlbumsByLabel>>} */
    const albums = yield call(searchAlbumsByLabel, token, action.payload)
    
    yield put(searchLabelFinished(albums))
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(searchLabelError())
  }
}

/**
 * Create playlist from label releases
 *
 * @param {ReturnType<typeof createLabelPlaylist>} action
 */
function* createLabelPlaylistSaga(action) {
  const abortController = new AbortController()

  try {
    /** @type {ReturnType<typeof getLabelPlaylistForm>} */
    const { isPublic } = yield select(getLabelPlaylistForm)
    const scope = isPublic ? Scope.PLAYLIST_MODIFY_PUBLIC : Scope.PLAYLIST_MODIFY_PRIVATE

    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(
      withTitle,
      'Creating label playlist...',
      createLabelPlaylistMainSaga,
      abortController.signal
    )
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [scope], titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(createLabelPlaylistError())
  } finally {
    if (yield cancelled()) abortController.abort()
  }
}

/**
 * Main label playlist creation saga
 *
 * @param {AbortSignal} signal
 */
function* createLabelPlaylistMainSaga(signal) {
  yield put(createLabelPlaylistStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<typeof getLabelPlaylistForm>} */
  const form = yield select(getLabelPlaylistForm)
  /** @type {ReturnType<typeof getLabelSelectedReleases>} */
  const selectedReleases = yield select(getLabelSelectedReleases)

  // Set up request workers for concurrent processing
  /** @type {RequestWorkers} */
  const { workers, requestChannel, responseChannel, workersFork } = yield call(setupWorkers, 5)
  yield fork(workersFork)

  try {
    // Get track IDs from selected releases using the request management system
    const albumIds = selectedReleases.map(release => release.id)
    const albumIdChunks = chunk(albumIds, 20) // Process in smaller chunks to avoid rate limits

    /** @type {string[]} */
    const allTrackIds = []

    for (const albumIdsChunk of albumIdChunks) {
      /** @type {Await<ReturnType<typeof getAlbumsTrackIds>>} */
      const trackIds = yield call(getAlbumsTrackIds, token, albumIdsChunk, signal)
      allTrackIds.push(...trackIds)
    }

    const trackUris = allTrackIds.map(trackId => spotifyUri(trackId, TRACK))

    // Create playlist
    /** @type {Await<ReturnType<typeof createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, form, signal)

    // Add tracks to playlist in chunks of 100
    const trackUriChunks = chunk(trackUris, 100)
    for (const trackUriChunk of trackUriChunks) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUriChunk, signal)
    }

    yield put(createLabelPlaylistFinished({ id: playlist.id, name: playlist.name }))
  } finally {
    yield cancel(workers)
  }
}