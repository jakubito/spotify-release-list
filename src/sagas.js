import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { getUser, getUserFollowedArtists, getArtistAlbums } from './api';
import { getDaysAgoDate, chunks, reflect, filterResolved } from './helpers';
import { getSettings, getToken } from './selectors';
import {
  SYNC,
  CREATE_PLAYLIST,
  setUser,
  syncFinished,
  syncError,
  addAlbums,
  setArtists,
  showErrorMessage,
} from './actions';

function* syncSaga() {
  try {
    const token = yield select(getToken);
    const user = yield call(getUser, token);
    yield put(setUser(user));
    const artists = yield call(getUserFollowedArtists, token);
    yield put(setArtists(artists));
    const { groups, market, days } = yield select(getSettings);
    const afterDateString = getDaysAgoDate(days);
    const artistChunks = chunks(artists, 6);

    for (const chunk of artistChunks) {
      const albumCalls = chunk.map((artist) =>
        call(reflect, getArtistAlbums, token, artist.id, groups, market)
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

function* createPlaylistSaga() {}

function* saga() {
  yield takeLatest(SYNC, syncSaga);
  yield takeLatest(CREATE_PLAYLIST, createPlaylistSaga);
}

export default saga;
