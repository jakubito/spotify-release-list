import React, { useCallback } from 'react';
import xor from 'lodash.xor';
import { useSelector, useDispatch } from 'react-redux';
import { AlbumGroup } from '../../enums';
import { getSettings } from '../../selectors';
import { setSettings } from '../../actions';

function AlbumGroupsField() {
  const { groups } = useSelector(getSettings);
  const dispatch = useDispatch();

  const groupsChangeHandler = useCallback(
    (event) => dispatch(setSettings({ groups: xor(groups, [event.target.name]) })),
    [dispatch, groups]
  );

  return (
    <div className="field">
      <label className="label has-text-light">Album types</label>
      <div className="control">
        {Object.entries(AlbumGroup).map(([value, name]) => (
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
