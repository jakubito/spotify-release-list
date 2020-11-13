import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { hidePlaylistModal, createPlaylist, setPlaylistForm } from 'state/actions'
import { getCreatingPlaylist, getPlaylistId, getReleasesCount } from 'state/selectors'
import { FieldName } from 'enums'
import { useModal } from 'hooks'
import { PlaylistForm, PlaylistInfo, Actions } from 'components/playlist'
import Button from 'components/Button'

const { NAME, DESCRIPTION, VISIBILITY } = FieldName

/**
 * Render new playlist modal
 */
function PlaylistModal() {
  const closeModal = useModal(hidePlaylistModal)
  const releasesCount = useSelector(getReleasesCount)
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const playlistId = useSelector(getPlaylistId)

  const form = useForm()
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const { handleSubmit } = form
  const onSubmit = useOnSubmit(setSubmitTriggered)

  useEffect(() => setSubmitTriggered(creatingPlaylist), [creatingPlaylist])

  return (
    <FormProvider {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-background" onClick={closeModal} />

        <div className="modal-content has-background-black-bis has-text-light">
          <h4 className="title is-4 has-text-light has-text-centered">
            Export <span className="has-text-primary">{releasesCount}</span>{' '}
            {releasesCount > 1 ? 'releases' : 'release'} to a new playlist
          </h4>

          {creatingPlaylist || playlistId ? <PlaylistInfo /> : <PlaylistForm />}

          <div className="actions columns is-gapless">
            <div className="column">
              <Actions submitTriggered={submitTriggered} />
            </div>

            {!creatingPlaylist && (
              <div className="column has-text-right">
                <Button
                  title="Close"
                  icon="fas fa-times"
                  onClick={closeModal}
                  disabled={submitTriggered}
                />
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

    const name = formData[NAME].trim()
    const description = formData[DESCRIPTION].trim()
    const isPrivate = formData[VISIBILITY] === 'private'

    dispatch(setPlaylistForm(name, description, isPrivate))
    dispatch(createPlaylist())
  }

  return onSubmit
}

export default PlaylistModal
