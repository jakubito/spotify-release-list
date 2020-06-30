import moment from 'moment';
import { channel, buffers } from 'redux-saga';
import {
  all,
  call,
  race,
  put,
  select,
  take,
  takeLeading,
  fork,
  cancel,
  delay,
} from 'redux-saga/effects';
import { chunks, getSpotifyUri } from 'helpers';
import { getSettings, getToken, getPlaylistForm, getUser as getUserSelector } from 'selectors';
import { SpotifyEntity, Moment, MomentFormat } from 'enums';
import {
  getUser,
  getUserFollowedArtists,
  getArtistAlbums,
  getAlbumsTrackIds,
  createPlaylist,
  addTracksToPlaylist,
} from 'api';
import {
  SYNC,
  CREATE_PLAYLIST,
  CREATE_PLAYLIST_CANCEL,
  setSyncingProgress,
  setUser,
  syncStart,
  syncFinished,
  syncError,
  setAlbums,
  showErrorMessage,
  createPlaylistStart,
  createPlaylistFinished,
  createPlaylistError,
} from 'actions';

const REQUEST_WORKERS = 6;
const PROGRESS_ANIMATION_MS = 550;
const STATUS_OK = 'STATUS_OK';
const STATUS_ERROR = 'STATUS_ERROR';

function takeLeadingCancellable(triggerAction, cancelAction, saga, ...args) {
  return fork(function* () {
    while (true) {
      const action = yield take(triggerAction);
      const task = yield fork(saga, ...args.concat(action));
      const [cancelled] = yield race([take(cancelAction), call(task.toPromise)]);

      if (cancelled) {
        yield cancel(task);
      }
    }
  });
}

function* progressWorker(progress, setProgressAction) {
  try {
    while (true) {
      yield put(setProgressAction(progress.value));
      yield delay(PROGRESS_ANIMATION_MS);
    }
  } finally {
    yield put(setProgressAction(progress.value));
  }
}

function* requestWorker(requestChannel, responseChannel) {
  while (true) {
    const request = yield take(requestChannel);

    try {
      const result = yield call(...request);

      yield put(responseChannel, { status: STATUS_OK, result });
    } catch (error) {
      yield put(responseChannel, { status: STATUS_ERROR, error });
    }
  }
}

function* syncSaga() {
  try {
    yield put(syncStart());

    const token = yield select(getToken);
    const { groups, market, days } = yield select(getSettings);
    const minDate = moment().subtract(days, Moment.DAY).format(MomentFormat.ISO_DATE);
    const albums = [];

    const user = yield call(getUser, token);
    const artists = yield call(getUserFollowedArtists, token);

    const tasks = [];
    const progress = { value: 0 };
    const requestChannel = yield call(channel, buffers.fixed(artists.length));
    const responseChannel = yield call(channel, buffers.fixed(REQUEST_WORKERS));

    for (let i = 0; i < REQUEST_WORKERS; i += 1) {
      tasks.push(yield fork(requestWorker, requestChannel, responseChannel));
    }

    tasks.push(yield fork(progressWorker, progress, setSyncingProgress));

    for (const artist of artists) {
      yield put(requestChannel, [getArtistAlbums, token, artist.id, groups, market, minDate]);
    }

    for (let fetched = 0; fetched < artists.length; fetched += 1) {
      const response = yield take(responseChannel);

      if (response.status === STATUS_OK) {
        albums.push(...response.result);
      }

      progress.value = ((fetched + 1) / artists.length) * 100;
    }

    yield cancel(tasks);
    yield delay(PROGRESS_ANIMATION_MS);

    yield put(setUser(user));
    yield put(setAlbums(albums, artists, minDate));
    yield put(syncFinished());
  } catch (error) {
    yield put(showErrorMessage());
    yield put(syncError());

    throw error;
  }
}

function* createPlaylistSaga() {
  try {
    yield put(createPlaylistStart());

    const token = yield select(getToken);
    const user = yield select(getUserSelector);
    const { albumIds, name, description, isPrivate } = yield select(getPlaylistForm);
    const { market } = yield select(getSettings);

    const trackIdsCalls = chunks(albumIds, 20).map((albumIdsChunk) =>
      call(getAlbumsTrackIds, token, albumIdsChunk, market)
    );

    const trackIds = yield all(trackIdsCalls);
    const trackUris = trackIds.flat().map((trackId) => getSpotifyUri(trackId, SpotifyEntity.TRACK));
    let firstPlaylist;

    for (const [part, playlistTrackUrisChunk] of chunks(trackUris, 9500).entries()) {
      const fullName = part > 0 ? `${name} (${part + 1})` : name;
      const playlist = yield call(createPlaylist, token, user.id, fullName, description, isPrivate);

      if (!firstPlaylist) {
        firstPlaylist = playlist;
      }

      for (const trackUrisChunk of chunks(playlistTrackUrisChunk, 100)) {
        yield call(addTracksToPlaylist, token, playlist.id, trackUrisChunk);
      }
    }

    yield put(createPlaylistFinished(firstPlaylist.id));
  } catch (error) {
    yield put(showErrorMessage());
    yield put(createPlaylistError());

    throw error;
  }
}

function* saga() {
  yield takeLeading(SYNC, syncSaga);
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga);
}

export default saga;
