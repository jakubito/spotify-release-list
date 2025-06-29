import {
  setFollowedArtists,
  unfollowArtistsStart,
  unfollowArtistsFinished,
  unfollowArtistsError,
} from 'state/actions'

/** @type {Pick<State, 'followedArtists' | 'unfollowingArtists'>} */
export const initialState = {
  followedArtists: [],
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