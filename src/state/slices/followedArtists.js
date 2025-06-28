import {
  setFollowedArtists,
  followArtistsStart,
  followArtistsFinished,
  followArtistsError,
  unfollowArtistsStart,
  unfollowArtistsFinished,
  unfollowArtistsError,
} from 'state/actions'

/** @type {Pick<State, 'followedArtists' | 'followingArtists' | 'unfollowingArtists'>} */
export const initialState = {
  followedArtists: [],
  followingArtists: false,
  unfollowingArtists: false,
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(setFollowedArtists, (state, action) => {
      // Deduplicate artists by ID using a Map
      const artistsMap = new Map()
      action.payload.forEach(artist => {
        artistsMap.set(artist.id, artist)
      })
      state.followedArtists = Array.from(artistsMap.values())
    })
    .addCase(followArtistsStart, (state) => {
      state.followingArtists = true
    })
    .addCase(followArtistsFinished, (state, action) => {
      state.followingArtists = false
      // Add the followed artists to the list if they're not already there
      const existingIds = new Set(state.followedArtists.map(artist => artist.id))
      const newArtists = action.payload.map(id => ({ id, name: 'Unknown Artist' }))
        .filter(artist => !existingIds.has(artist.id))
      state.followedArtists.push(...newArtists)
    })
    .addCase(followArtistsError, (state) => {
      state.followingArtists = false
    })
    .addCase(unfollowArtistsStart, (state) => {
      state.unfollowingArtists = true
    })
    .addCase(unfollowArtistsFinished, (state, action) => {
      state.unfollowingArtists = false
      // Remove the unfollowed artists from the list
      const unfollowedIds = new Set(action.payload)
      state.followedArtists = state.followedArtists.filter(
        artist => !unfollowedIds.has(artist.id)
      )
    })
    .addCase(unfollowArtistsError, (state) => {
      state.unfollowingArtists = false
    })
}