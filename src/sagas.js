import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import {
  getUser,
  getUserFollowedArtists,
  getArtistAlbums,
  getAlbumsTrackIds,
  createPlaylist,
  addTracksToPlaylist,
} from 'api';
import { chunks, reflect, filterResolved, getSpotifyUri } from 'helpers';
import { getSettings, getToken, getPlaylistForm, getUser as getUserSelector } from 'selectors';
import {
  SYNC,
  CREATE_PLAYLIST,
  setUser,
  syncFinished,
  syncError,
  addAlbums,
  setArtists,
  showErrorMessage,
  createPlaylistFinished,
  createPlaylistError,
} from 'actions';
import { SpotifyEntity, Moment, MomentFormat } from 'enums';

function* syncSaga() {
  try {
    const token = yield select(getToken);
    const user = yield call(getUser, token);

    yield put(setUser(user));

    const artists = yield call(getUserFollowedArtists, token);

    yield put(setArtists(artists));

    const { groups, market, days } = yield select(getSettings);
    const afterDateString = moment().subtract(days, Moment.DAY).format(MomentFormat.ISO_DATE);

    for (const artistsChunk of chunks(artists, 6)) {
      const albumCalls = artistsChunk.map((artist) =>
        call(reflect, getArtistAlbums, token, artist.id, groups, market, afterDateString)
      );
      const albumResponses = yield all(albumCalls);
      const albums = filterResolved(albumResponses).flat();

      yield put(addAlbums(albums, afterDateString));
    }

    yield put(syncFinished());
  } catch (error) {
    yield put(showErrorMessage());
    yield put(syncError());

    throw error;
  }
}

function* createPlaylistSaga() {
  try {
    const token = yield select(getToken);
    const user = yield select(getUserSelector);
    const form = yield select(getPlaylistForm);
    const { market } = yield select(getSettings);
    const trackIds = [];

    for (const albumIdsChunk of chunks(form.albumIds, 20)) {
      const newTrackIds = yield call(getAlbumsTrackIds, token, albumIdsChunk, market);

      trackIds.push(...newTrackIds);
    }

    const trackUris = trackIds.map((trackId) => getSpotifyUri(trackId, SpotifyEntity.TRACK));
    let firstPlaylist;
    let part = 1;

    for (const playlistTrackUrisChunk of chunks(trackUris, 10000)) {
      const name = part > 1 ? `${form.name} (${part})` : form.name;
      const playlist = yield call(
        createPlaylist,
        token,
        user.id,
        name,
        form.description,
        form.isPrivate
      );

      if (!firstPlaylist) {
        firstPlaylist = playlist;
      }

      for (const trackUrisChunk of chunks(playlistTrackUrisChunk, 100)) {
        yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk);
      }

      part += 1;
    }

    yield put(createPlaylistFinished(firstPlaylist.id));
  } catch (error) {
    yield put(showErrorMessage());
    yield put(createPlaylistError());

    throw error;
  }
}

function* saga() {
  yield takeLatest(SYNC, syncSaga);
  yield takeLatest(CREATE_PLAYLIST, createPlaylistSaga);
}

export default saga;
