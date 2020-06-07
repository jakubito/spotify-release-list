import React, { useCallback } from 'react';
import xor from 'lodash.xor';
import { useSelector, useDispatch } from 'react-redux';
import { AlbumGroup } from 'enums';
import { getSettings } from 'selectors';
import { setSettings } from 'actions';

const fields = {
  [AlbumGroup.ALBUM]: 'Albums',
  [AlbumGroup.SINGLE]: 'Singles',
  [AlbumGroup.COMPILATION]: 'Compilations',
  [AlbumGroup.APPEARS_ON]: 'Appearances',
};

const fieldsEntries = Object.entries(fields);
const albumGroupValues = Object.values(AlbumGroup);

function sortByAlbumGroup(first, second) {
  return albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second);
}

function AlbumGroupsField() {
  const { groups } = useSelector(getSettings);
  const dispatch = useDispatch();

  const onChange = useCallback(
    (event) => {
      const newGroups = xor(groups, [event.target.value]).sort(sortByAlbumGroup);

      dispatch(setSettings({ groups: newGroups }));
    },
    [groups]
  );

  return (
    <div className="field">
      <label className="label has-text-light">Album types</label>
      <div className="control">
        {fieldsEntries.map(([value, name]) => (
          <div className="field" key={value}>
            <input
              type="checkbox"
              className="is-checkradio has-background-color is-white"
              id={`albumGroups[${value}]`}
              name={`albumGroups[${value}]`}
              value={value}
              checked={groups.includes(value)}
              onChange={onChange}
            />
            <label htmlFor={`albumGroups[${value}]`} className="has-text-weight-semibold">
              {name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumGroupsField;
