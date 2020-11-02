import { all, call, put, select } from 'redux-saga/effects'
import { chunks, getSpotifyUri } from 'helpers'
import { getSettings, getToken, getPlaylistForm, getUser as getUserSelector } from 'state/selectors'
import { SpotifyEntity } from 'enums'
import { getAlbumsTrackIds, createPlaylist, addTracksToPlaylist } from 'api'
import {
  showErrorMessage,
  createPlaylistStart,
  createPlaylistFinished,
  createPlaylistError,
} from 'state/actions'

/**
 * Playlist creation saga
 */
export function* createPlaylistSaga() {
  try {
    yield put(createPlaylistStart())

    const token = yield select(getToken)
    const user = yield select(getUserSelector)
    const { albumIds, name, description, isPrivate } = yield select(getPlaylistForm)
    const { market } = yield select(getSettings)

    const trackIdsCalls = chunks(albumIds, 20).map((albumIdsChunk) =>
      call(getAlbumsTrackIds, token, albumIdsChunk, market)
    )

    const trackIds = yield all(trackIdsCalls)
    const trackUris = trackIds.flat().map((trackId) => getSpotifyUri(trackId, SpotifyEntity.TRACK))
    /** @type {SpotifyPlaylist} */
    let firstPlaylist

    for (const [part, playlistTrackUrisChunk] of chunks(trackUris, 9500).entries()) {
      const fullName = part > 0 ? `${name} (${part + 1})` : name
      const playlist = yield call(createPlaylist, token, user.id, fullName, description, isPrivate)

      if (!firstPlaylist) {
        firstPlaylist = playlist
      }

      for (const trackUrisChunk of chunks(playlistTrackUrisChunk, 100)) {
        yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk)
      }
    }

    yield put(createPlaylistFinished(firstPlaylist.id))
  } catch (error) {
    yield put(showErrorMessage())
    yield put(createPlaylistError())

    throw error
  }
}
