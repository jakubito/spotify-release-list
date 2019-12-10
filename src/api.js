import { buildUser, buildArtist, buildAlbum, sleep } from './helpers';

function getApiUrl(endpoint) {
  return `https://api.spotify.com/v1/${endpoint}`;
}

async function callApi(endpoint, token) {
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  // Handle too many requests error
  if (response.status === 429) {
    const retryAfterMs = Number(response.headers.get('Retry-After')) * 1000 + 100;

    await sleep(retryAfterMs);

    return callApi(endpoint, token);
  }

  throw new Error(
    `💢 Fetch Error; Status: ${response.status}; Status text: ${response.statusText}`
  );
}

export async function getUser(token) {
  const userResponse = await callApi(getApiUrl('me'), token);
  const user = buildUser(userResponse);

  return user;
}

export async function getUserFollowedArtists(token) {
  let artists = [];
  let next = getApiUrl('me/following?type=artist&limit=50');

  while (next) {
    const response = await callApi(next, token);
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

  const response = await callApi(getApiUrl(url), token);
  const albums = response.items.map((album) => buildAlbum(album, artistId));

  return albums;
}
