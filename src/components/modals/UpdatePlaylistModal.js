import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SpotifyEntity } from 'enums'
import { useModal } from 'hooks'
import { defer, spotifyLink } from 'helpers'
import {
  loadPlaylists,
  setSelectedPlaylistId,
  updatePlaylist,
  updatePlaylistCancel,
} from 'state/actions'
import {
  getLoadingPlaylists,
  getPlaylistResult,
  getPlaylists,
  getReleasesArray,
  getReleasesTrackCount,
  getSelectedPlaylistId,
  getSettingsUriLinks,
  getUpdatingPlaylist,
} from 'state/selectors'
import { PlaylistInfo, PlaylistLoading } from 'components/playlist'
import { Button, ButtonAnchor, Select } from 'components/common'

/**
 * @param {{ closeModal: () => void }} props
 */
function UpdatePlaylistModal({ closeModal }) {
  const dispatch = useDispatch()
  const albums = useSelector(getReleasesArray)
  const totalTrackCount = useSelector(getReleasesTrackCount)
  const playlists = useSelector(getPlaylists)
  const selectedPlaylistId = useSelector(getSelectedPlaylistId)
  const loadingPlaylists = useSelector(getLoadingPlaylists)
  const updatingPlaylist = useSelector(getUpdatingPlaylist)
  const playlistResult = useSelector(getPlaylistResult)
  const uriLinks = useSelector(getSettingsUriLinks)
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const [strategy, setStrategy] = useState(/** @type {PlaylistUpdateStrategy} */ ('append'))

  useModal(closeModal)
  useEffect(() => setSubmitTriggered(updatingPlaylist), [updatingPlaylist])

  const renderContent = () => {
    if (updatingPlaylist) {
      return (
        <PlaylistLoading
          title="Updating playlist, please wait..."
          cancel={() => dispatch(updatePlaylistCancel())}
        />
      )
    }

    if (playlistResult) {
      return (
        <PlaylistInfo
          title="Playlist has been successfully updated"
          playlist={playlistResult}
          close={closeModal}
        />
      )
    }

    /** @returns {SelectOptions} */
    const getOptions = () => {
      if (loadingPlaylists) return [['', 'Loading playlists...']]
      if (playlists.length === 0) return [['', 'No playlists found']]
      return playlists.map(({ id, name }) => [id, name])
    }

    return (
      <>
        <div className="field">
          <label className="UpdatePlaylistModal__label label has-text-light" htmlFor="name">
            Select playlist
            {loadingPlaylists ? (
              <i className="UpdatePlaylistModal__spinner fas fa-spinner fa-spin-pulse" />
            ) : (
              <Button
                title="Refresh"
                className="UpdatePlaylistModal__refresh"
                icon="fas fa-sync"
                onClick={() => dispatch(loadPlaylists())}
                small
                text
              />
            )}
          </label>
          <div className="field is-grouped">
            <Select
              disabled={loadingPlaylists || playlists.length === 0}
              options={getOptions()}
              onChange={(event) => dispatch(setSelectedPlaylistId(event.currentTarget.value))}
              value={selectedPlaylistId ?? ''}
              fullWidth
            />
            {selectedPlaylistId && !loadingPlaylists && (
              <div className="control">
                <ButtonAnchor
                  title="View"
                  icon="fas fa-arrow-up-right-from-square"
                  href={spotifyLink(selectedPlaylistId, SpotifyEntity.PLAYLIST, uriLinks)}
                  text
                />
              </div>
            )}
          </div>
          <div className="field">
            <label className="label has-text-light">Choose update strategy</label>
            <div className="control">
              <div className="field">
                <input
                  name="strategy"
                  className="is-checkradio has-background-color is-white"
                  id="strategyUpdate"
                  type="radio"
                  value="append"
                  defaultChecked={strategy === 'append'}
                  onChange={() => setStrategy('append')}
                />
                <label htmlFor="strategyUpdate">Append</label>
              </div>
              <div className="field">
                <input
                  name="strategy"
                  className="is-checkradio has-background-color is-white"
                  id="strategyReplace"
                  type="radio"
                  value="replace"
                  checked={strategy === 'replace'}
                  onChange={() => setStrategy('replace')}
                />
                <label htmlFor="strategyReplace">Replace</label>
              </div>
            </div>
          </div>
        </div>
        {strategy === 'replace' && (
          <article className="message is-danger fade-in">
            <div className="UpdatePlaylistModal__warning message-body">
              <i className="fas fa-exclamation-triangle" />
              This will remove all existing tracks from the selected playlist. Use with caution.
            </div>
          </article>
        )}
        <div className="actions">
          <Button
            title="Update"
            disabled={submitTriggered || loadingPlaylists || !selectedPlaylistId}
            onClick={() => {
              setSubmitTriggered(true)
              const selectedPlaylist = playlists.find(
                (playlist) => playlist.id === selectedPlaylistId
              )
              defer(dispatch, updatePlaylist({ playlist: selectedPlaylist, strategy }))
            }}
            primary
          />
          <Button title="Close" disabled={submitTriggered} onClick={closeModal} />
        </div>
      </>
    )
  }

  return (
    <div className="UpdatePlaylistModal PlaylistModal modal is-active">
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
    </div>
  )
}

export default UpdatePlaylistModal
