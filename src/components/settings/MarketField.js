import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Market } from 'enums';
import { getSettingsMarket } from 'selectors';
import { setSettings } from 'actions';
import { delay } from 'helpers';

function MarketField() {
  const market = useSelector(getSettingsMarket);
  const dispatch = useDispatch();

  const onChange = useCallback((event) => {
    delay(dispatch, 0, setSettings({ market: event.target.value }));
  }, []);

  return (
    <div className="field">
      <label className="label has-text-light">Market country</label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select defaultValue={market} onChange={onChange}>
            <option value="">All markets</option>
            {Object.entries(Market).map(([code, name]) => (
              <option value={code} key={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <span className="icon is-left">
          <i className="fas fa-globe"></i>
        </span>
      </div>
    </div>
  );
}

export default MarketField;
