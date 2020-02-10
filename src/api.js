import { buildUser, buildArtist, buildAlbum, sleep } from './helpers';

function apiUrl(endpoint) {
  return `https://api.spotify.com/v1/${endpoint}`;
}

function get(endpoint, token) {
  return callApi(endpoint, token, 'GET');
}

function post(endpoint, token, body) {
  return callApi(
    endpoint,
    token,
    'POST',
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    JSON.stringify(body)
  );
}

async function callApi(endpoint, token, method, headers = {}, body) {
  const response = await fetch(endpoint, {
    method,
    body,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  // Handle 429 Too many requests
  if (response.status === 429) {
    const waitMs = Number(response.headers.get('Retry-After')) * 1000 + 100;

    await sleep(waitMs);

    return callApi(endpoint, token, method, headers, body);
  }

  if (response.status >= 400 && response.status < 500) {
    const json = await response.json();

    throw new Error(`
      Fetch 4XX Response
      Status: ${response.status} ${response.statusText}
      Message: ${json.error.message}
    `);
  }

  throw new Error(`
    Fetch Error
    Status: ${response.status} ${response.statusText}
  `);
}

export async function getUser(token) {
  const userResponse = await get(apiUrl('me'), token);
  const user = buildUser(userResponse);

  return user;
}

export async function getUserFollowedArtists(token) {
  let artists = [];
  let next = apiUrl('me/following?type=artist&limit=50');

  while (next) {
    const response = await get(next, token);
    const newArtists = response.artists.items.map(buildArtist);

    artists = artists.concat(newArtists);
    next = response.artists.next;
  }

  return artists;
}

export async function getArtistAlbums(token, artistId, groups, market) {
  let url = `artists/${artistId}/albums?limit=20&include_groups=${groups.join(',')}`;

  if (market) {
    url += `&market=${market}`;
  }

  const response = await get(apiUrl(url), token);
  const albums = response.items.map((album) => buildAlbum(album, artistId));

  return albums;
}

export async function getAlbumsTrackIds(token, albumIds, market) {
  let trackIds = [];
  let url = `albums?ids=${albumIds.join(',')}`;

  if (market) {
    url += `&market=${market}`;
  }

  const response = await get(apiUrl(url), token);

  for (const album of response.albums) {
    if (!album) {
      continue;
    }

    let albumTrackIds = album.tracks.items.map((track) => track.id);
    let next = album.tracks.next;

    while (next) {
      const response = await get(next, token);
      const newAlbumTrackIds = response.items.map((track) => track.id);

      albumTrackIds = albumTrackIds.concat(newAlbumTrackIds);
      next = response.next;
    }

    trackIds = trackIds.concat(albumTrackIds);
  }

  return trackIds;
}

export function createPlaylist(token, userId, name, description, isPrivate) {
  return post(apiUrl(`users/${userId}/playlists`), token, {
    name,
    description,
    public: !isPrivate,
  });
}

export function addTracksToPlaylist(token, playlistId, trackUris) {
  return post(apiUrl(`playlists/${playlistId}/tracks`), token, { uris: trackUris });
}
