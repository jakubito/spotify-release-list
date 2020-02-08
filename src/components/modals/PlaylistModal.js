import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import { hidePlaylistModal } from '../../actions';
import { useModal } from '../../hooks';
import { getDayReleasesMap } from '../../selectors';
import { FieldName } from '../../enums';
import { DateRangeField, NameField, DescriptionField, VisibilityField } from '../playlist';

function useReleasesCount(watch) {
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

      current.add(1, 'day');
    }

    return count;
  }, [releases, startDate, endDate]);
}

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const form = useForm();
  const { register, watch, handleSubmit } = form;
  const releasesCount = useReleasesCount(watch);

  const onSubmit = useCallback((data) => {
    // TODO
    console.log(data);
  }, []);

  const onSubmitHandler = useCallback(handleSubmit(onSubmit), [handleSubmit]);

  register({ name: FieldName.NAME_CUSTOM });

  return (
    <FormContext {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={onSubmitHandler}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">
            Create playlist from releases
          </h4>

          <DateRangeField releasesCount={releasesCount} />
          <NameField />
          <DescriptionField />
          <VisibilityField />

          <div className="actions columns is-gapless">
            <div className="column">
              <button
                type="submit"
                className="button is-primary is-rounded has-text-weight-semibold"
                disabled={!releasesCount}
              >
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
      </form>
    </FormContext>
  );
}

export default PlaylistModal;
