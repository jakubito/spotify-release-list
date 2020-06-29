import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSettingsDays } from 'selectors';
import { setSettings } from 'actions';
import { defer } from 'helpers';

function TimePeriodField() {
  const days = useSelector(getSettingsDays);
  const dispatch = useDispatch();

  const onChange = useCallback((event) => {
    defer(dispatch, setSettings({ days: Number(event.target.value) }));
  }, []);

  return (
    <div className="field">
      <label className="label has-text-light">Time period</label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select defaultValue={days.toString()} onChange={onChange}>
            <option value="7">Past week</option>
            <option value="30">Past month</option>
            <option value="90">Past 3 months</option>
            <option value="180">Past 6 months</option>
            <option value="365">Past year</option>
          </select>
        </div>
        <span className="icon is-left">
          <i className="fas fa-history"></i>
        </span>
      </div>
    </div>
  );
}

export default TimePeriodField;
