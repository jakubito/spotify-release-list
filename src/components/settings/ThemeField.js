import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSettings } from 'selectors';
import { setSettings } from 'actions';
import { delay } from 'helpers';
import { Theme } from 'enums';

function ThemeField() {
  const { theme } = useSelector(getSettings);
  const dispatch = useDispatch();

  const onChange = useCallback((event) => {
    delay(dispatch, 0, setSettings({ theme: event.target.value }));
  }, []);

  return (
    <div className="field">
      <label className="label has-text-grey-lighter">Theme</label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select defaultValue={theme} onChange={onChange}>
            <option value="">Dark (default)</option>
            <option value={Theme.COMPACT}>Dark compact</option>
            <option value={Theme.LIGHT}>Light</option>
            <option value={`${Theme.LIGHT} ${Theme.COMPACT}`}>Light compact</option>
          </select>
        </div>
        <span className="icon is-left">
          <i className="fas fa-palette"></i>
        </span>
      </div>
    </div>
  );
}

export default ThemeField;
