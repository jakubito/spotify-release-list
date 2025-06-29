import { call, put, takeLeading, select } from 'redux-saga/effects'
import chunk from 'lodash/chunk'
import { Scope } from 'enums'
import { searchAlbumsByLabel, getAlbumsTrackIds, createPlaylist, addTracksToPlaylist, FetchError } from 'api'
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
  showErrorMessage,
} from 'state/actions'
import {
  getLabelSelectedReleases,
  getLabelPlaylistForm,
  getUser,
} from 'state/selectors'
import { authorize } from './auth'
import { withTitle } from './helpers'

const { TRACK } = SpotifyEntity

/**
 * Main label explorer saga
 */
export function* labelExplorerSaga() {
  yield takeLeading(searchLabel.type, searchLabelSaga)
  yield takeLeading(createLabelPlaylist.type, createLabelPlaylistSaga)
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
  try {
    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(
      withTitle,
      'Creating label playlist...',
      createLabelPlaylistMainSaga
    )
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [Scope.PLAYLIST_MODIFY_PRIVATE, Scope.PLAYLIST_MODIFY_PUBLIC], titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(createLabelPlaylistError())
  }
}

/**
 * Main label playlist creation saga
 */
function* createLabelPlaylistMainSaga() {
  yield put(createLabelPlaylistStart())

  try {
    /** @type {ReturnType<typeof getAuthData>} */
    const { token } = yield call(getAuthData)
    /** @type {ReturnType<typeof getUser>} */
    const user = yield select(getUser)
    /** @type {ReturnType<typeof getLabelPlaylistForm>} */
    const form = yield select(getLabelPlaylistForm)
    /** @type {ReturnType<typeof getLabelSelectedReleases>} */
    const selectedReleases = yield select(getLabelSelectedReleases)

    // Get track IDs from selected releases
    const albumIds = selectedReleases.map(release => release.id)
    
    /** @type {Await<ReturnType<typeof getAlbumsTrackIds>>} */
    const trackIds = yield call(getAlbumsTrackIds, token, albumIds)
    const trackUris = trackIds.map(trackId => spotifyUri(trackId, TRACK))

    // Create playlist
    /** @type {Await<ReturnType<typeof createPlaylist>>} */
    const playlist = yield call(createPlaylist, token, user.id, form)

    // Add tracks to playlist in chunks of 100
    for (const trackUrisChunk of chunk(trackUris, 100)) {
      yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk)
    }

    yield put(createLabelPlaylistFinished({ id: playlist.id, name: playlist.name }))
  } catch (error) {
    // Handle rate limit errors specifically
    if (error instanceof FetchError && error.status === 429) {
      yield put(showErrorMessage(error.message))
    } else {
      yield put(showErrorMessage(error.message ?? error.toString()))
    }
    yield put(createLabelPlaylistError())
  }
}