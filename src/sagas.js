import { all, call, put, select, takeLatest, take, fork, cancel } from 'redux-saga/effects';
import moment from 'moment';
import {
  getUser,
  getUserFollowedArtists,
  getArtistAlbums,
  getAlbumsTrackIds,
  createPlaylist,
  addTracksToPlaylist,
} from 'api';
import { chunks, reflect, filterResolved, getSpotifyUri, sleep } from 'helpers';
import { getSettings, getToken, getPlaylistForm, getUser as getUserSelector } from 'selectors';
import {
  SYNC,
  CREATE_PLAYLIST,
  CREATE_PLAYLIST_CANCEL,
  setSyncingProgress,
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

const ARTISTS_CHUNK_SIZE = 6;

function takeLatestCancellable(triggerAction, cancelAction, saga, ...args) {
  return fork(function* () {
    let task;

    while (true) {
      const action = yield take([triggerAction, cancelAction]);

      if (task) {
        yield cancel(task);
      }

      if (action.type === triggerAction) {
        task = yield fork(saga, ...args.concat(action));
      }
    }
  });
}

function* syncSaga() {
  try {
    const token = yield select(getToken);
    const user = yield call(getUser, token);

    yield put(setUser(user));

    const artists = yield call(getUserFollowedArtists, token);

    yield put(setArtists(artists));

    const { groups, market, days } = yield select(getSettings);
    const afterDateString = moment().subtract(days, Moment.DAY).format(MomentFormat.ISO_DATE);
    let artistsFetched = 0;

    for (const artistsChunk of chunks(artists, ARTISTS_CHUNK_SIZE)) {
      const albumCalls = artistsChunk.map((artist) =>
        call(reflect, getArtistAlbums, token, artist.id, groups, market, afterDateString)
      );
      const albumResponses = yield all(albumCalls);
      const albums = filterResolved(albumResponses).flat();
      artistsFetched += ARTISTS_CHUNK_SIZE;

      yield put(addAlbums(albums, afterDateString));
      yield put(setSyncingProgress((artistsFetched / artists.length) * 100));
    }

    yield call(sleep, 600); // wait for progress bar animation
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

    for (const playlistTrackUrisChunk of chunks(trackUris, 9500)) {
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
  yield takeLatestCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga);
}

export default saga;
