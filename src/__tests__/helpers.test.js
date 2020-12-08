import moment from 'moment'
import {
  sleep,
  defer,
  chunks,
  generateNonce,
  playlistName,
  getReleasesBetween,
  spotifyUri,
  spotifyUrl,
  getImage,
  buildUser,
  buildArtist,
  buildAlbum,
} from 'helpers'
import { getOriginalReleasesMap } from 'state/selectors'
import mockState from './fixtures/state.json'

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

describe('chunks', () => {
  it('returns equally sized chunks', () => {
    const testArray = [1, 2, 3, 4, 5, 6]
    const actual = chunks(testArray, 2)
    const expected = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]

    expect(actual).toEqual(expected)
  })

  it('returns variable sized chunks', () => {
    const testArray = [1, 2, 3, 4, 5]
    const actual = chunks(testArray, 2)
    const expected = [[1, 2], [3, 4], [5]]

    expect(actual).toEqual(expected)
  })

  it('returns single sized chunks', () => {
    const testArray = [1, 2, 3, 4, 5]
    const actual = chunks(testArray, 1)
    const expected = [[1], [2], [3], [4], [5]]

    expect(actual).toEqual(expected)
  })

  it('returns single chunk', () => {
    const testArray = [1, 2, 3, 4, 5]
    const actual = chunks(testArray, 7)
    const expected = [[1, 2, 3, 4, 5]]

    expect(actual).toEqual(expected)
  })

  it('returns empty array', () => {
    const actual = chunks([], 2)

    expect(actual).toEqual([])
  })

  it("doesn't modify source array", () => {
    const testArray = [1, 2, 3, 4, 5]
    const testArrayCopy = [...testArray]

    chunks(testArray, 2)
    expect(testArray).toEqual(testArrayCopy)
  })
})

describe('generateNonce', () => {
  it('returns non-empty string', () => {
    const actual = generateNonce()

    expect(typeof actual).toEqual('string')
    expect(actual.length).toEqual(20)
  })

  it('returns random string', () => {
    const array = Array.from(Array(20), () => generateNonce())
    const set = new Set(array)

    expect(array.length).toEqual(set.size)
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
    const start = moment('2020-11-10')
    const end = moment('2020-11-11')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)
    const expected = [
      '5GQm35tkCTK25fQmTou7Nu',
      '78ueU6gK8spqEZwfMH1pcx',
      '0qZ6LUWpJC4lrQrEDoUeHH',
      '1lg90yDEGtCceipwjSCrYg',
      '6KLdZzsb6MZ9pNxH4D6SZy',
    ]

    expect(actual).toEqual(expected)
  })

  it('returns releases for single day', () => {
    const start = moment('2020-11-14')
    const end = moment('2020-11-14')
    const actual = getReleasesBetween(getOriginalReleasesMap(mockState), start, end)
    const expected = ['61Q8fil8hlD3sh65V7zA6t']

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
  it('creates user object', () => {
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
  it('creates artist object', () => {
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

describe('buildAlbum', () => {
  it('creates album object', () => {
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
      album_group: 'testAlbumGroup',
    }
    const actual = buildAlbum(spotifyAlbum, 'testArtistId')
    const expected = {
      id: 'testId',
      name: 'Test Album',
      image: 'imageUrl300',
      artists: [{ id: 'testId', name: 'Test Artist' }],
      releaseDate: 'testReleaseDate',
      artistId: 'testArtistId',
      group: 'testAlbumGroup',
    }

    expect(actual).toEqual(expected)
  })
})
