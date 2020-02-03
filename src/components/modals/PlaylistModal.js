import React, { useCallback } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { hidePlaylistModal } from '../../actions';
import { useModal } from '../../hooks';
import { DateRangeField, NameField, DescriptionField, VisibilityField } from '../playlist';

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const form = useForm();
  const { handleSubmit } = form;

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

          <DateRangeField />
          <NameField />
          <DescriptionField />
          <VisibilityField />

          <div className="actions columns is-gapless">
            <div className="column">
              <button
                type="submit"
                className="button is-primary is-rounded has-text-weight-semibold"
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
