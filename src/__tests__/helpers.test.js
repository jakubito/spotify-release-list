import moment from 'moment'
import {
  sleep,
  defer,
  playlistName,
  getReleasesBetween,
  spotifyUri,
  spotifyUrl,
  spotifyLink,
  getImage,
  buildUser,
  buildArtist,
  buildAlbumRaw,
} from 'helpers'
import { AlbumGroup } from 'enums'
import { getOriginalReleasesMap } from 'state/selectors'
import mockStateJson from './fixtures/state'

const mockState = /** @type {State} */ (mockStateJson)

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()
  })

  it('returns promise', () => {
    expect(sleep(100)).toBeInstanceOf(Promise)
  })

  it('waits specified time', async () => {
    const ms = 100
    const mockFn = jest.fn()
    const promise = sleep(ms).then(mockFn)

    expect(mockFn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(ms)
    await promise
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})

describe('defer', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
      fn(1)
      return 1
    })
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.clearAllTimers()
  })

  it('executes input function', () => {
    const mockFn = jest.fn()
    const args = ['a', false, 45]

    defer(mockFn, ...args)
    expect(mockFn).not.toHaveBeenCalled()
    jest.runAllTimers()
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenLastCalledWith(...args)
  })
})

describe('playlistName', () => {
  it('works with different days', () => {
    const start = moment('2020-01-15')
    const end = moment('2020-02-08')
    const actual = playlistName(start, end)

    expect(actual).toEqual('Jan 15 - Feb 8 Releases')
  })

  it('works with single day', () => {
    const start = moment('2020-01-15')
    const end = moment('2020-01-15')
    const actual = playlistName(start, end)

    expect(actual).toEqual('Jan 15 Releases')
  })
})

describe('getReleasesBetween', () => {
  it('returns releases between two different dates', () => {
    const start = moment('2020-12-21')
    const end = moment('2020-12-23')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)
    const expected = [
      '6gjkcRBjs91tu1bLOWtrUu',
      '5ML0ID0YZa7a1Tt9UrJTsV',
      '11IHuohdssMJA8s84Yhk1p',
      '23fsap8rIKsbRAl8WqJodr',
      '09VOQplwXpjOKuDopwBTlA',
    ]

    expect(actual).toEqual(expected)
  })

  it('returns releases for single day', () => {
    const start = moment('2020-12-24')
    const end = moment('2020-12-24')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)
    const expected = ['4q12KARGFFPQfSS8F1V40p', '38Vwhxf7JAO7ErH2h4j9q0']

    expect(actual).toEqual(expected)
  })

  it('returns empty array if start date > end date', () => {
    const start = moment('2020-11-14')
    const end = moment('2020-11-12')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)

    expect(actual).toEqual([])
  })

  it('returns empty array for non-existing dates', () => {
    const start = moment('2020-05-01')
    const end = moment('2020-05-06')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)

    expect(actual).toEqual([])
  })
})

describe('spotifyUri', () => {
  it('returns correct URI', () => {
    const actual = spotifyUri('123', 'track')
    const expected = 'spotify:track:123'

    expect(actual).toEqual(expected)
  })
})

describe('spotifyUrl', () => {
  it('returns correct URL', () => {
    const actual = spotifyUrl('123', 'track')
    const expected = 'https://open.spotify.com/track/123'

    expect(actual).toEqual(expected)
  })
})

describe('spotifyLink', () => {
  it('returns correct URI', () => {
    const actual = spotifyLink('123', 'track', true)
    const expected = 'spotify:track:123'

    expect(actual).toEqual(expected)
  })

  it('returns correct URL', () => {
    const actual = spotifyLink('123', 'track', false)
    const expected = 'https://open.spotify.com/track/123'

    expect(actual).toEqual(expected)
  })
})

describe('getImage', () => {
  it('prioritizes 300px wide image and return its url', () => {
    const actual = getImage([
      { width: 100, height: 100, url: 'imageUrl100' },
      { width: 300, height: 300, url: 'imageUrl300' },
      { width: 600, height: 600, url: 'imageUrl600' },
    ])

    expect(actual).toEqual('imageUrl300')
  })

  it('falls back to the first image', () => {
    const actual = getImage([
      { width: 100, height: 100, url: 'imageUrl100' },
      { width: 400, height: 400, url: 'imageUrl400' },
      { width: 600, height: 600, url: 'imageUrl600' },
    ])

    expect(actual).toEqual('imageUrl100')
  })

  it('returns null', () => {
    expect(getImage()).toBeNull()
    expect(getImage(null)).toBeNull()
    expect(getImage([])).toBeNull()
  })
})

describe('buildUser', () => {
  it('creates User object', () => {
    const spotifyUser = {
      id: 'testId',
      display_name: 'Test User',
      images: [
        { width: 100, height: 100, url: 'imageUrl100' },
        { width: 300, height: 300, url: 'imageUrl300' },
        { width: 600, height: 600, url: 'imageUrl600' },
      ],
    }
    const actual = buildUser(spotifyUser)
    const expected = {
      id: 'testId',
      name: 'Test User',
      image: 'imageUrl300',
    }

    expect(actual).toEqual(expected)
  })
})

describe('buildArtist', () => {
  it('creates Artist object', () => {
    const spotifyArtist = {
      id: 'testId',
      name: 'Test Artist',
    }
    const actual = buildArtist(spotifyArtist)
    const expected = {
      id: 'testId',
      name: 'Test Artist',
    }

    expect(actual).toEqual(expected)
  })
})

describe('buildAlbumRaw', () => {
  it('creates AlbumRaw object', () => {
    const spotifyAlbum = {
      id: 'testId',
      name: 'Test Album',
      images: [
        { width: 100, height: 100, url: 'imageUrl100' },
        { width: 300, height: 300, url: 'imageUrl300' },
        { width: 600, height: 600, url: 'imageUrl600' },
      ],
      artists: [{ id: 'testId', name: 'Test Artist' }],
      release_date: 'testReleaseDate',
      album_group: AlbumGroup.SINGLE,
      album_type: AlbumGroup.SINGLE,
      total_tracks: 20,
    }
    const actual = buildAlbumRaw(spotifyAlbum, 'testArtistId')
    const expected = {
      id: 'testId',
      name: 'Test Album',
      image: 'imageUrl300',
      albumArtists: [{ id: 'testId', name: 'Test Artist' }],
      releaseDate: 'testReleaseDate',
      totalTracks: 20,
      artistIds: {
        single: ['testArtistId'],
      },
    }

    expect(actual).toEqual(expected)
  })
})
