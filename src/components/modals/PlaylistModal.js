import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { hidePlaylistModal, createPlaylist, setNonce, setPlaylistForm } from 'actions';
import { useModal } from 'hooks';
import {
  getCreatingPlaylist,
  getToken,
  getTokenExpires,
  getTokenScope,
  getPlaylistId,
} from 'selectors';
import { FieldName } from 'enums';
import { isValidCreatePlaylistToken, startCreatePlaylistAuthFlow } from 'auth';
import { generateNonce } from 'helpers';
import { persistor } from 'store';
import { PlaylistForm, PlaylistInfo, Actions } from 'components/playlist';

export function useOnSubmit(setSubmitTriggered) {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);
  const tokenScope = useSelector(getTokenScope);

  const onSubmit = async (formData) => {
    const albumIds = formData[FieldName.RELEASES].filter((releaseId) =>
      formData[FieldName.SELECTED_RELEASES].has(releaseId)
    );
    const name = formData[FieldName.NAME].trim();
    const description = formData[FieldName.DESCRIPTION].trim();
    const isPrivate = formData[FieldName.VISIBILITY] === 'private';

    dispatch(setPlaylistForm(albumIds, name, description, isPrivate));

    if (isValidCreatePlaylistToken(token, tokenExpires, tokenScope, isPrivate)) {
      dispatch(createPlaylist());
    } else {
      const nonce = generateNonce();

      setSubmitTriggered(true);
      dispatch(setNonce(nonce));

      await persistor.flush();

      startCreatePlaylistAuthFlow(nonce, isPrivate);
    }
  };

  return onSubmit;
}

function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal);
  const creatingPlaylist = useSelector(getCreatingPlaylist);
  const playlistId = useSelector(getPlaylistId);
  const form = useForm();
  const [submitTriggered, setSubmitTriggered] = useState(false);
  const { register, handleSubmit } = form;
  const onSubmit = useOnSubmit(setSubmitTriggered);

  useEffect(() => {
    register({ name: FieldName.START_DATE }, { required: true });
    register({ name: FieldName.END_DATE }, { required: true });
    register({ name: FieldName.NAME_CUSTOM });
    register(
      { name: FieldName.RELEASES },
      { required: true, validate: (value) => value.length > 0 }
    );
    register(
      { name: FieldName.SELECTED_RELEASES },
      { required: true, validate: (value) => value.size > 0 }
    );
  }, [register]);

  return (
    <FormProvider {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-background" onClick={closeModal}></div>

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">New playlist</h4>

          {creatingPlaylist || playlistId ? <PlaylistInfo /> : <PlaylistForm />}

          <div className="actions columns is-gapless">
            <div className="column">
              <Actions submitTriggered={submitTriggered} />
            </div>

            {!creatingPlaylist && (
              <div className="column has-text-right">
                <button
                  className="button is-dark is-rounded has-text-weight-semibold"
                  onClick={closeModal}
                  disabled={submitTriggered}
                >
                  <span className="icon">
                    <i className="fas fa-times"></i>
                  </span>
                  <span>Close</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default PlaylistModal;
