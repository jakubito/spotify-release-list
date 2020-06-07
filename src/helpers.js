import orderBy from 'lodash.orderby';
import { Moment, MomentFormat } from 'enums';

let intervalId;

export function saveInterval(...args) {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(...args);
}

export function mergeAlbumArtists(album, artistsMap) {
  return Object.values(album.groups)
    .flat()
    .reduce((acc, artistId) => {
      const artistNotIncluded = acc.findIndex((artist) => artist.id === artistId) === -1;

      if (artistNotIncluded) {
        return [...acc, artistsMap[artistId]];
      }

      return acc;
    }, album.artists);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function reflect(fn, ...args) {
  try {
    const data = await fn(...args);

    return { data, status: 'resolved' };
  } catch (error) {
    return { error, status: 'rejected' };
  }
}

export function filterResolved(responses) {
  return responses.filter(({ status }) => status === 'resolved').map(({ data }) => data);
}

export function chunks(inputArray, chunkSize) {
  const input = [...inputArray];
  const result = [];

  while (input.length > 0) {
    result.push(input.splice(0, chunkSize));
  }

  return result;
}

export function generateNonce() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export function toggleSetValue(set, value) {
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }

  return set;
}

/**
 * Get playlist name suggestion.
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @returns {string}
 */
export function getPlaylistNameSuggestion(startDate, endDate) {
  if (!startDate || !endDate) {
    return null;
  }

  const startDateFormatted = startDate.format('MMM D');
  const endDateFormatted = endDate.format('MMM D');

  if (startDateFormatted === endDateFormatted) {
    return `${startDateFormatted} Releases`;
  }

  return `${startDateFormatted} - ${endDateFormatted} Releases`;
}

/**
 * Get release IDs released between startDate and endDate.
 *
 * @param {Object} releases Releases map from redux store
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @returns {(Array|null)}
 */
export function getReleasesByDate(releases, startDate, endDate) {
  if (!releases || !startDate || !endDate) {
    return null;
  }

  const filteredReleases = [];
  const current = endDate.clone();

  while (current.isSameOrAfter(startDate)) {
    const currentFormatted = current.format(MomentFormat.ISO_DATE);

    if (releases[currentFormatted]) {
      const currentReleases = orderBy(releases[currentFormatted], 'name');
      const currentReleasesIds = currentReleases.map(({ id }) => id);

      filteredReleases.push(...currentReleasesIds);
    }

    current.subtract(1, Moment.DAY);
  }

  return filteredReleases;
}

export function getSpotifyUri(id, entity) {
  return `spotify:${entity}:${id}`;
}

export function getSpotifyUrl(id, entity) {
  return `https://open.spotify.com/${entity}/${id}`;
}

function getImage(images) {
  if (!images || !images.length) {
    return null;
  }

  for (const image of images) {
    if (image.width === 300) {
      return image.url;
    }
  }

  return images[0].url;
}

export function buildUser(source) {
  return {
    id: source.id,
    name: source.display_name,
    image: getImage(source.images),
  };
}

export function buildArtist(source) {
  return {
    id: source.id,
    url: source.external_urls.spotify,
    uri: source.uri,
    name: source.name,
  };
}

export function buildAlbum(source, artistId) {
  return {
    id: source.id,
    url: source.external_urls.spotify,
    uri: source.uri,
    name: source.name,
    image: getImage(source.images),
    artists: source.artists.map(buildArtist),
    releaseDate: source.release_date,
    releaseDatePrecision: source.release_date_precision,
    groups: {
      album: [],
      single: [],
      compilation: [],
      appears_on: [],
    },
    meta: {
      group: source.album_group,
      artistId,
    },
  };
}
