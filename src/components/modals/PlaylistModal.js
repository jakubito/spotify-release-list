import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { useModal } from 'hooks'
import { createPlaylist, setPlaylistForm } from 'state/actions'
import { getCreatingPlaylist, getPlaylistId, getReleasesCount } from 'state/selectors'
import { PlaylistForm, PlaylistInfo, PlaylistLoading } from 'components/playlist'

/**
 * Render new playlist modal
 *
 * @param {{ closeModal: () => void }} props
 */
function PlaylistModal({ closeModal }) {
  const releasesCount = useSelector(getReleasesCount)
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const playlistId = useSelector(getPlaylistId)
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const onSubmit = useOnSubmit(setSubmitTriggered)
  const form = useForm()

  useModal(closeModal)
  useEffect(() => setSubmitTriggered(creatingPlaylist), [creatingPlaylist])

  const renderContent = () => {
    if (creatingPlaylist) {
      return <PlaylistLoading />
    }

    if (playlistId) {
      return <PlaylistInfo closeModal={closeModal} />
    }

    return <PlaylistForm submitTriggered={submitTriggered} closeModal={closeModal} />
  }

  return (
    <FormProvider {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="modal-background" onClick={closeModal} />
        <div className="modal-content has-background-black-bis has-text-light fade-in">
          <h4 className="title is-4 has-text-light has-text-centered">
            Exporting <span className="has-text-primary">{releasesCount}</span>{' '}
            {releasesCount > 1 ? 'releases' : 'release'}
          </h4>
          {renderContent()}
        </div>
      </form>
    </FormProvider>
  )
}

/** @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitTriggered */
function useOnSubmit(setSubmitTriggered) {
  const dispatch = useDispatch()
  /**
   * @type {SubmitHandler<{
   *   name: string
   *   description: string
   *   visibility: 'private' | 'public'
   * }>}
   */
  const onSubmit = async (formData) => {
    setSubmitTriggered(true)

    const name = formData.name.trim()
    const description = formData.description.trim()
    const isPrivate = formData.visibility === 'private'

    dispatch(setPlaylistForm(name, description, isPrivate))
    dispatch(createPlaylist())
  }

  return onSubmit
}

export default PlaylistModal
