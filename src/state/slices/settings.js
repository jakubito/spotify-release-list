import { albumsNew } from 'albums'
import { deleteLabels } from 'helpers'
import { AlbumGroup, ArtistSource, GroupColorSchemes, ReleasesOrder } from 'enums'
import {
  applyLabelBlocklist,
  setLabelBlocklistHeight,
  setLastSettingsPath,
  setSettings,
} from 'state/actions'

/** @type {Pick<State, 'lastSettingsPath' | 'labelBlocklistHeight' | 'settings'>} */
export const initialState = {
  lastSettingsPath: null,
  labelBlocklistHeight: null,
  settings: {
    artistSources: [ArtistSource.FOLLOWED],
    minimumSavedTracks: 1,
    groups: Object.values(AlbumGroup),
    groupColors: GroupColorSchemes.DEFAULT,
    days: 30,
    theme: '',
    uriLinks: false,
    covers: true,
    autoSync: false,
    autoSyncTime: '08:00',
    notifications: true,
    firstDayOfWeek: 0,
    displayTracks: false,
    fullAlbumData: false,
    displayLabels: false,
    displayPopularity: false,
    labelBlocklist: '',
    artistBlocklist: '',
    releasesOrder: ReleasesOrder.ARTIST,
    trackHistory: true,
  },
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(setSettings, (state, action) => {
      Object.assign(state.settings, action.payload)
    })
    .addCase(setLastSettingsPath, (state, action) => {
      state.lastSettingsPath = action.payload
    })
    .addCase(applyLabelBlocklist, (state) => {
      const deletedIds = deleteLabels(state.albums, state.settings.labelBlocklist)
      for (const id of deletedIds) {
        albumsNew.delete(id)
        delete state.favorites[id]
      }
    })
    .addCase(setLabelBlocklistHeight, (state, action) => {
      state.labelBlocklistHeight = action.payload
    })
}
