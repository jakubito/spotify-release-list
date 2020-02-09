import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import classNames from 'classnames';
import { hidePlaylistModal } from '../../../actions';
import { useModal } from '../../../hooks';
import { getCreatingPlaylist } from '../../../selectors';
import { FieldName } from '../../../enums';
import { DateRangeField, NameField, DescriptionField, VisibilityField } from '../../playlist';
import { useReleasesCount, useOnSubmit } from './hooks';

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const form = useForm();
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const { register, watch, handleSubmit } = form;
  const releasesCount = useReleasesCount(watch);
  const onSubmit = useOnSubmit(setCancelDisabled);
  const onSubmitHandler = useCallback(handleSubmit(onSubmit), [handleSubmit, onsubmit]);

  register({ name: FieldName.NAME_CUSTOM });

  return (
    <FormContext {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={onSubmitHandler}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">New playlist</h4>

          <DateRangeField releasesCount={releasesCount} />
          <NameField />
          <DescriptionField />
          <VisibilityField />

          <div className="actions columns is-gapless">
            <div className="column">
              <button
                type="submit"
                className={classNames(
                  'button',
                  'is-primary',
                  'is-rounded',
                  'has-text-weight-semibold',
                  { 'is-loading': creatingPlaylist }
                )}
                disabled={creatingPlaylist || !releasesCount}
              >
                <span className="icon">
                  <i className="fas fa-asterisk"></i>
                </span>
                <span>Create</span>
              </button>
            </div>

            <div className="column has-text-right">
              <button
                className="button is-dark is-rounded has-text-weight-semibold"
                onClick={closeModal}
                disabled={cancelDisabled}
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
