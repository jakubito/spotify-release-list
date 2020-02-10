import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import classNames from 'classnames';
import {
  hidePlaylistModal,
  createPlaylist,
  setNonce,
  setPlaylist,
  setCreatingPlaylist,
} from '../../actions';
import { useModal } from '../../hooks';
import { getCreatingPlaylist, getToken, getTokenExpires, getTokenScope } from '../../selectors';
import { FieldName } from '../../enums';
import { isValidCreatePlaylistToken, startCreatePlaylistAuthFlow } from '../../auth';
import { generateNonce, sleep } from '../../helpers';
import { PlaylistForm, PlaylistInfo } from '../playlist';

export function useOnSubmit(setCancelDisabled) {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);
  const tokenScope = useSelector(getTokenScope);

  return useCallback(
    async (formData) => {
      const startDate = formData.startDate.format('YYYY-MM-DD');
      const endDate = formData.endDate.format('YYYY-MM-DD');
      const name = formData.name.trim();
      const description = formData.description ? formData.description.trim() : null;
      const isPrivate = formData.visibility === 'private';

      if (isValidCreatePlaylistToken(token, tokenExpires, tokenScope, isPrivate)) {
        dispatch(createPlaylist());
      } else {
        const nonce = generateNonce();

        setCancelDisabled(true);
        dispatch(setCreatingPlaylist(true));
        dispatch(setNonce(nonce));
        dispatch(setPlaylist(startDate, endDate, name, description, isPrivate));
        await sleep(500);

        startCreatePlaylistAuthFlow(nonce, isPrivate);
      }
    },
    [setCancelDisabled, token, tokenExpires, tokenScope, dispatch]
  );
}

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const form = useForm();
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const { register, handleSubmit } = form;
  const onSubmit = useOnSubmit(setCancelDisabled);
  const onSubmitHandler = useCallback(handleSubmit(onSubmit), [handleSubmit, onsubmit]);

  register({ name: FieldName.RELEASES_COUNT }, { required: true, min: 1 });
  register({ name: FieldName.NAME_CUSTOM });

  return (
    <FormContext {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={onSubmitHandler}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">New playlist</h4>

          {creatingPlaylist ? <PlaylistInfo /> : <PlaylistForm />}

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
