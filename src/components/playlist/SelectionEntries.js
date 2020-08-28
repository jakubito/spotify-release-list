import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Waypoint } from 'react-waypoint';
import { FieldName } from 'enums';
import { toggleSetValue, defer } from 'helpers';
import AlbumFullTitle from './AlbumFullTitle';

const LIMIT_INCREMENT = 50;

function Shortcut({ label, onClick }) {
  return (
    <button
      type="button"
      className="button is-rounded is-small is-dark is-darker"
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  );
}

function ReleaseField({ releaseId, selectedReleases, onChange }) {
  return (
    <div className="field" key={releaseId}>
      <input
        type="checkbox"
        className={classNames('is-checkradio is-small is-white', {
          'has-background-color': selectedReleases.has(releaseId),
        })}
        id={`selectedReleases[${releaseId}]`}
        name={`selectedReleases[${releaseId}]`}
        value={releaseId}
        checked={selectedReleases.has(releaseId)}
        onChange={onChange}
      />
      <label
        htmlFor={`selectedReleases[${releaseId}]`}
        className={classNames('is-unselectable', {
          'has-text-grey': !selectedReleases.has(releaseId),
        })}
      >
        <AlbumFullTitle id={releaseId} />
      </label>
    </div>
  );
}

function SelectionEntries() {
  const { setValue, watch } = useFormContext();
  const [limit, setLimit] = useState(LIMIT_INCREMENT);
  const [animate, setAnimate] = useState(false);
  const container = useRef();
  const inner = useRef();

  const releases = watch(FieldName.RELEASES);
  const selectedReleases = watch(FieldName.SELECTED_RELEASES);

  const onChangeHandler = (event) => {
    defer(
      setValue,
      FieldName.SELECTED_RELEASES,
      toggleSetValue(selectedReleases, event.target.value),
      true
    );
  };

  useEffect(() => {
    setAnimate(inner.current.scrollHeight > container.current.clientHeight);
  }, [releases]);

  return (
    <div className="selection">
      <Shortcut
        label="Select all"
        onClick={() => defer(setValue, FieldName.SELECTED_RELEASES, new Set(releases), true)}
      />
      <Shortcut
        label="Unselect all"
        onClick={() => defer(setValue, FieldName.SELECTED_RELEASES, new Set([]), true)}
      />

      <div className="container" ref={container}>
        <div className={classNames('inner', { animate })} ref={inner}>
          {releases.slice(0, limit).map((releaseId) => (
            <ReleaseField
              releaseId={releaseId}
              selectedReleases={selectedReleases}
              onChange={onChangeHandler}
              key={releaseId}
            />
          ))}
          {limit < releases.length && (
            <Waypoint
              bottomOffset="-100%"
              onEnter={() => setLimit((limit) => limit + LIMIT_INCREMENT)}
              key={limit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

Shortcut.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

ReleaseField.propTypes = {
  releaseId: PropTypes.string.isRequired,
  selectedReleases: PropTypes.instanceOf(Set).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectionEntries;
