import { channel, buffers } from 'redux-saga';
import { all, call, race, put, select, take, takeLeading, fork, cancel } from 'redux-saga/effects';
import moment from 'moment';
import {
  getUser,
  getUserFollowedArtists,
  getArtistAlbums,
  getAlbumsTrackIds,
  createPlaylist,
  addTracksToPlaylist,
} from 'api';
import { chunks, getSpotifyUri, sleep } from 'helpers';
import { getSettings, getToken, getPlaylistForm, getUser as getUserSelector } from 'selectors';
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
  setArtists,
  showErrorMessage,
  createPlaylistStart,
  createPlaylistFinished,
  createPlaylistError,
} from 'actions';
import { SpotifyEntity, Moment, MomentFormat } from 'enums';

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
      yield call(sleep, PROGRESS_ANIMATION_MS);
      yield put(setProgressAction(progress.value));
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
    const requestChannel = yield call(channel, buffers.expanding(10));
    const responseChannel = yield call(channel, buffers.expanding(10));

    for (let i = 0; i < REQUEST_WORKERS; i += 1) {
      tasks.push(yield fork(requestWorker, requestChannel, responseChannel));
    }

    tasks.push(yield fork(progressWorker, progress, setSyncingProgress));

    for (const artist of artists) {
      yield put(requestChannel, [getArtistAlbums, token, artist.id, groups, market, minDate]);
    }

    for (let artistsFetched = 0; artistsFetched < artists.length; artistsFetched += 1) {
      const response = yield take(responseChannel);

      if (response.status === STATUS_OK) {
        albums.push(...response.result);
      }

      progress.value = ((artistsFetched + 1) / artists.length) * 100;
    }

    yield cancel(tasks);
    yield call(sleep, PROGRESS_ANIMATION_MS);

    yield put(setUser(user));
    yield put(setArtists(artists));
    yield put(setAlbums(albums, minDate));
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
    const form = yield select(getPlaylistForm);
    const { market } = yield select(getSettings);

    const trackIdsCalls = chunks(form.albumIds, 20).map((albumIdsChunk) =>
      call(getAlbumsTrackIds, token, albumIdsChunk, market)
    );

    const trackIds = yield all(trackIdsCalls);
    const trackUris = trackIds.flat().map((trackId) => getSpotifyUri(trackId, SpotifyEntity.TRACK));
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
  yield takeLeading(SYNC, syncSaga);
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga);
}

export default saga;
