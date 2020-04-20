import React, { useCallback } from 'react';
import xor from 'lodash.xor';
import { useSelector, useDispatch } from 'react-redux';
import { AlbumGroup } from '../../enums';
import { getSettings } from '../../selectors';
import { setSettings } from '../../actions';

const fields = {
  [AlbumGroup.ALBUM]: 'Albums',
  [AlbumGroup.SINGLE]: 'Singles',
  [AlbumGroup.COMPILATION]: 'Compilations',
  [AlbumGroup.APPEARS_ON]: 'Appearances',
};

const albumGroupValues = Object.values(AlbumGroup);

function sortByAlbumGroup(first, second) {
  return albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second);
}

function AlbumGroupsField() {
  const { groups } = useSelector(getSettings);
  const dispatch = useDispatch();

  const groupsChangeHandler = useCallback(
    (event) => {
      dispatch(
        setSettings({
          groups: xor(groups, [event.target.name]).sort(sortByAlbumGroup),
        })
      );
    },
    [groups]
  );

  return (
    <div className="field">
      <label className="label has-text-light">Album types</label>
      <div className="control">
        {Object.entries(fields).map(([value, name]) => (
          <div className="field" key={value}>
            <input
              className="is-checkradio has-background-color is-white"
              id={`albumGroupInput${value}`}
              type="checkbox"
              name={value}
              checked={groups.includes(value)}
              onChange={groupsChangeHandler}
            />
            <label htmlFor={`albumGroupInput${value}`} className="has-text-weight-semibold">
              {name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumGroupsField;
