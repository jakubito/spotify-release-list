import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import Media from 'react-media';
import { hidePlaylistModal } from '../../actions';
import { useModal } from '../../hooks';

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focus, setFocus] = useState(null);

  return (
    <div className="PlaylistModal modal is-active">
      <div className="modal-background" onClick={closeModal}></div>

      <div className="modal-content has-background-black-bis has-text-light">
        <h4 className="title is-4 has-text-light has-text-centered">
          Create playlist from releases
        </h4>

        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label has-text-light">Date range</label>
              <div className="control date-range has-text-grey">
                <Media query={{ maxWidth: 425 }}>
                  {(matches) => (
                    <DateRangePicker
                      startDate={startDate}
                      startDateId="new_playlist_start_date"
                      endDate={endDate}
                      endDateId="new_playlist_end_date"
                      onDatesChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                      }}
                      focusedInput={focus}
                      onFocusChange={(focusedInput) => setFocus(focusedInput)}
                      numberOfMonths={1}
                      firstDayOfWeek={1}
                      minimumNights={0}
                      readOnly={matches}
                    />
                  )}
                </Media>
              </div>

              <div className="date-helpers">
                <button className="button is-dark is-rounded is-small">
                  <span>Last week</span>
                </button>
                <button className="button is-dark is-rounded is-small">
                  <span>Last 2 weeks</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label has-text-light">Name</label>
          <div className="control">
            <input className="input is-rounded" type="text" value="" />
          </div>
        </div>

        <div className="field">
          <label className="label has-text-light">Description</label>
          <div className="control">
            <input className="input is-rounded" type="text" placeholder="Optional" />
          </div>
        </div>

        <div className="field">
          <label className="label has-text-light">Visibility</label>
          <div className="control">
            <div className="field">
              <input
                className="is-checkradio has-background-color is-white"
                id="uriLinksFalse"
                type="radio"
                name="0"
                checked
              />
              <label htmlFor="uriLinksFalse">Public</label>
            </div>
            <div className="field">
              <input
                className="is-checkradio has-background-color is-white"
                id="uriLinksTrue"
                type="radio"
                name="1"
              />
              <label htmlFor="uriLinksTrue">Private</label>
            </div>
          </div>
        </div>

        <div className="actions columns is-gapless">
          <div className="column">
            <button className="button is-primary is-rounded has-text-weight-semibold">
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
              <span>Create</span>
            </button>
          </div>
          <div className="column has-text-right">
            <button
              className="button is-dark is-rounded has-text-weight-semibold"
              onClick={closeModal}
            >
              <span className="icon">
                <i className="fas fa-times"></i>
              </span>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistModal;
