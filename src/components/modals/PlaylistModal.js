import { useEffect, useState } from 'react'
import { playlistName } from 'helpers'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { useModal } from 'hooks'
import { createPlaylist, createPlaylistCancel, setPlaylistForm } from 'state/actions'
import {
  getCreatingPlaylist,
  getFiltersDates,
  getPlaylistResult,
  getReleasesArray,
  getReleasesTrackCount,
} from 'state/selectors'
import { PlaylistForm, PlaylistInfo, PlaylistLoading } from 'components/playlist'

/**
 * Render new playlist modal
 *
 * @param {{ closeModal: () => void }} props
 */
function PlaylistModal({ closeModal }) {
  const dispatch = useDispatch()
  const albums = useSelector(getReleasesArray)
  const totalTrackCount = useSelector(getReleasesTrackCount)
  const filtersDates = useSelector(getFiltersDates)
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const playlistResult = useSelector(getPlaylistResult)
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const onSubmit = useOnSubmit(setSubmitTriggered)

  /** @type {PlaylistFormData} */
  const defaultFormValues = {
    name: playlistName(filtersDates?.startDate, filtersDates?.endDate),
    description: '',
    visibility: 'private',
    followedArtistsOnly: false,
  }
  const form = useForm({ defaultValues: defaultFormValues })

  useModal(closeModal)
  useEffect(() => setSubmitTriggered(creatingPlaylist), [creatingPlaylist])

  const renderContent = () => {
    if (creatingPlaylist) {
      return (
        <PlaylistLoading
          title="Creating your playlist..."
          cancel={() => {
            form.reset()
            dispatch(createPlaylistCancel())
          }}
        />
      )
    }

    if (playlistResult) {
      return <PlaylistInfo title="Playlist created!" playlist={playlistResult} close={closeModal} />
    }

    return <PlaylistForm submitTriggered={submitTriggered} closeModal={closeModal} />
  }

  return (
    <FormProvider {...form}>
      <form className="PlaylistModal modal is-active" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="modal-background" onClick={closeModal} />
        <div className="modal-content has-background-black-bis has-text-light fade-in">
          <h4 className="title is-4 has-text-light has-text-centered">
            Exporting <span className="has-text-primary">{albums.length}</span>{' '}
            {albums.length > 1 ? 'releases' : 'release'} (
            <span className="has-text-primary">{totalTrackCount}</span>&nbsp;
            {totalTrackCount > 1 ? 'tracks' : 'track'})
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
   * @param {PlaylistFormData} formData
   * @returns {Promise<void>}
   */
  const onSubmit = async (formData) => {
    setSubmitTriggered(true)

    const name = formData.name.trim()
    const description = formData.description.trim()
    const isPublic = formData.visibility === 'public'
    const { followedArtistsOnly } = formData

    dispatch(setPlaylistForm({ name, description, isPublic, followedArtistsOnly }))
    dispatch(createPlaylist())
  }

  return onSubmit
}

export default PlaylistModal
