import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { getUser, getUserFollowedArtists, getArtistAlbums } from './api';
import { SYNC, setUser, syncFinished, addAlbums, setArtists } from './actions';
import { getDaysAgoDate, chunks, reflect, filterResolved } from './helpers';
import { getSettings } from './selectors';

function* sync(action) {
  try {
    const { token } = action.payload;
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
  } catch (error) {
    console.error(error);
  } finally {
    yield put(syncFinished());
  }
}

function* saga() {
  yield takeLatest(SYNC, sync);
}

export default saga;
