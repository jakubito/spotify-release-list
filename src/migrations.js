import { AlbumGroup } from './enums';

export default {
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup);
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    );

    return {
      ...state,
      settings: {
        ...state.settings,
        groups: groupsSorted,
      },
    };
  },
};
