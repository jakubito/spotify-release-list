import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import classNames from 'classnames';
import { hidePlaylistModal } from '../../actions';
import { useModal } from '../../hooks';
import { getDayReleasesMap } from '../../selectors';
import { DateRangeField, NameField, DescriptionField, VisibilityField } from '../playlist';

const FieldName = Object.freeze({
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  NAME: 'name',
  DESCRIPTION: 'description',
  VISIBILITY: 'visibility',
});

function useMatchedReleasesCount(watch) {
  const releases = useSelector(getDayReleasesMap);
  const startDate = watch(FieldName.START_DATE);
  const endDate = watch(FieldName.END_DATE);

  return useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    let current = startDate.clone();
    let count = 0;

    while (current <= endDate) {
      const currentFormatted = current.format('YYYY-MM-DD');

      if (releases[currentFormatted]) {
        count += releases[currentFormatted].length;
      }

      current.add(1, 'days');
    }

    return count;
  }, [releases, startDate, endDate]);
}

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const form = useForm();
  const { watch, handleSubmit } = form;
  const matchedReleasesCount = useMatchedReleasesCount(watch);

  const onSubmit = useCallback((data) => {
    // TODO
    console.log(data);
  }, []);

  const onSubmitHandler = useCallback(handleSubmit(onSubmit), [handleSubmit]);

  return (
    <FormContext {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={onSubmitHandler}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">
            Create playlist from releases
          </h4>

          <DateRangeField startDateName={FieldName.START_DATE} endDateName={FieldName.END_DATE} />
          <NameField name={FieldName.NAME} />
          <DescriptionField name={FieldName.DESCRIPTION} />
          <VisibilityField name={FieldName.VISIBILITY} />

          <div className="actions columns is-gapless">
            <div className="column is-narrow">
              <button
                type="submit"
                className="button is-primary is-rounded has-text-weight-semibold"
                disabled={!matchedReleasesCount}
              >
                <span className="icon">
                  <i className="fas fa-check"></i>
                </span>
                <span>Create</span>
              </button>
            </div>

            <div className="column matched">
              {matchedReleasesCount !== null && (
                <div
                  className={classNames('matched-count', {
                    'has-text-grey': matchedReleasesCount > 0,
                    'has-text-danger': matchedReleasesCount === 0,
                  })}
                >
                  Releases found: {matchedReleasesCount}
                </div>
              )}
            </div>

            <div className="column is-narrow has-text-right">
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
      </form>
    </FormContext>
  );
}

export default PlaylistModal;
