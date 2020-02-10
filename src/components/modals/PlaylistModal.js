import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormContext } from 'react-hook-form';
import classNames from 'classnames';
import {
  hidePlaylistModal,
  createPlaylist,
  setNonce,
  setPlaylistForm,
  setCreatingPlaylist,
} from '../../actions';
import { useModal } from '../../hooks';
import {
  getCreatingPlaylist,
  getToken,
  getTokenExpires,
  getTokenScope,
  getWorking,
  getPlaylistId,
} from '../../selectors';
import { FieldName } from '../../enums';
import { isValidCreatePlaylistToken, startCreatePlaylistAuthFlow } from '../../auth';
import { generateNonce, sleep } from '../../helpers';
import { PlaylistForm, PlaylistInfo } from '../playlist';

export function useOnSubmit(setCloseDisabled) {
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

      dispatch(setPlaylistForm(startDate, endDate, name, description, isPrivate));

      if (isValidCreatePlaylistToken(token, tokenExpires, tokenScope, isPrivate)) {
        dispatch(createPlaylist());
      } else {
        const nonce = generateNonce();

        setCloseDisabled(true);
        dispatch(setCreatingPlaylist(true));
        dispatch(setNonce(nonce));
        await sleep(500);

        startCreatePlaylistAuthFlow(nonce, isPrivate);
      }
    },
    [setCloseDisabled, token, tokenExpires, tokenScope, dispatch]
  );
}

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const playlistId = useSelector(getPlaylistId);
  const working = useSelector(getWorking);
  const form = useForm();
  const [closeDisabled, setCloseDisabled] = useState(false);
  const { register, handleSubmit } = form;
  const onSubmit = useOnSubmit(setCloseDisabled);
  const onSubmitHandler = useCallback(handleSubmit(onSubmit), [handleSubmit, onsubmit]);

  register({ name: FieldName.RELEASES_COUNT }, { required: true, min: 1 });
  register({ name: FieldName.NAME_CUSTOM });

  return (
    <FormContext {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={onSubmitHandler}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">New playlist</h4>

          {creatingPlaylist || playlistId ? <PlaylistInfo /> : <PlaylistForm />}

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
                disabled={working}
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
                disabled={closeDisabled}
              >
                <span className="icon">
                  <i className="fas fa-times"></i>
                </span>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormContext>
  );
}

export default PlaylistModal;
