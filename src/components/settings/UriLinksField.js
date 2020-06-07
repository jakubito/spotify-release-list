import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSettings } from 'selectors';
import { setSettings } from 'actions';
import { delay } from 'helpers';

function UriLinksField() {
  const { uriLinks } = useSelector(getSettings);
  const dispatch = useDispatch();

  const onChange = useCallback((event) => {
    const newUriLinks = Boolean(Number(event.target.value));

    delay(dispatch, 0, setSettings({ uriLinks: newUriLinks }));
  }, []);

  return (
    <div className="field">
      <label className="label has-text-light">Open links in</label>
      <div className="control">
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="uriLinksFalse"
            type="radio"
            name="uriLinks"
            value="0"
            defaultChecked={!uriLinks}
            onChange={onChange}
          />
          <label htmlFor="uriLinksFalse">New tab</label>
        </div>
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="uriLinksTrue"
            type="radio"
            name="uriLinks"
            value="1"
            defaultChecked={uriLinks}
            onChange={onChange}
          />
          <label htmlFor="uriLinksTrue">Spotify app</label>
        </div>
      </div>
    </div>
  );
}

export default UriLinksField;
