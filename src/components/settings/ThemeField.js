import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { getSettingsTheme } from 'selectors';
import { setSettings } from 'actions';
import { delay } from 'helpers';
import { Theme, Feature } from 'enums';
import { useFeature } from 'hooks';

const themes = Object.values(Theme);

function ThemeField() {
  const theme = useSelector(getSettingsTheme);
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [featureSeen, setFeatureSeen] = useFeature(Feature.THEMES);

  const onChange = useCallback(
    (event) => {
      delay(setFeatureSeen, 0);
      delay(dispatch, 0, setSettings({ theme: event.target.value }));
    },
    [setFeatureSeen]
  );

  useEffect(() => {
    if (firstRender.current) {
      // Theme already applied before first render, skip effect
      firstRender.current = false;

      return;
    }

    document.documentElement.classList.remove(...themes);

    if (theme) {
      document.documentElement.classList.add(...theme.split(' '));
    }
  }, [theme]);

  return (
    <div className="field">
      <label className="label has-text-grey-lighter">
        Theme{' '}
        <div
          className={classNames('badge badge-inline is-primary has-text-weight-semibold', {
            'is-hidden': featureSeen,
          })}
        >
          NEW
        </div>
      </label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select defaultValue={theme} onChange={onChange}>
            <option value="">Default</option>
            <option value={Theme.COMPACT}>Compact</option>
            <option value={Theme.SINGLE_COLUMN}>Single Column</option>
            <option value={`${Theme.SINGLE_COLUMN} ${Theme.COMPACT}`}>
              Single Column - Compact
            </option>
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
