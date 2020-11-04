import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { hidePlaylistModal, createPlaylist, setPlaylistForm } from 'state/actions'
import { useModal } from 'hooks'
import { getCreatingPlaylist, getPlaylistId } from 'state/selectors'
import { FieldName } from 'enums'
import { PlaylistForm, PlaylistInfo, Actions } from 'components/playlist'

const {
  START_DATE,
  END_DATE,
  NAME,
  NAME_CUSTOM,
  DESCRIPTION,
  VISIBILITY,
  RELEASES,
  SELECTED_RELEASES,
} = FieldName

/**
 * Render new playlist modal
 */
function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal)
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const playlistId = useSelector(getPlaylistId)
  const form = useForm()
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const { register, handleSubmit } = form
  const onSubmit = useOnSubmit(setSubmitTriggered)

  useEffect(() => {
    register({ name: START_DATE }, { required: true })
    register({ name: END_DATE }, { required: true })
    register({ name: NAME_CUSTOM })
    register({ name: RELEASES }, { required: true, validate: (value) => value.length > 0 })
    register({ name: SELECTED_RELEASES }, { required: true, validate: (value) => value.size > 0 })
  }, [register])

  useEffect(() => {
    setSubmitTriggered(creatingPlaylist)
  }, [creatingPlaylist])

  return (
    <FormProvider {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-background" onClick={closeModal} />

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">Export to a new playlist</h4>

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
                    <i className="fas fa-times" />
                  </span>
                  <span>Close</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

/**
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitTriggered
 */
function useOnSubmit(setSubmitTriggered) {
  const dispatch = useDispatch()
  const onSubmit = async (formData) => {
    setSubmitTriggered(true)

    const albumIds = formData[RELEASES].filter((releaseId) =>
      formData[SELECTED_RELEASES].has(releaseId)
    )
    const name = formData[NAME].trim()
    const description = formData[DESCRIPTION].trim()
    const isPrivate = formData[VISIBILITY] === 'private'

    dispatch(setPlaylistForm(albumIds, name, description, isPrivate))
    dispatch(createPlaylist())
  }

  return onSubmit
}

export default PlaylistModal
