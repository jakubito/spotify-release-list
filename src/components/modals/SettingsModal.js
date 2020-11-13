import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hideSettingsModal, showResetModal } from 'state/actions'
import { useModal } from 'hooks'
import { getUser } from 'state/selectors'
import Button from 'components/Button'
import {
  AlbumGroupsField,
  TimePeriodField,
  MarketField,
  UriLinksField,
  CoversField,
  ThemeField,
  Credits,
} from 'components/settings'

/**
 * Render settings modal
 */
function SettingsModal() {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const closeModal = useModal(hideSettingsModal)

  return (
    <div className="SettingsModal modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-content has-background-black-bis has-text-light">
        <h4 className="title is-4 has-text-light has-text-centered">Settings</h4>

        <div className="columns">
          <div className="column">
            <AlbumGroupsField />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <TimePeriodField />
          </div>
          <div className="column">
            <MarketField />
          </div>
        </div>

        <div className="columns">
          <div className="column is-half">
            <ThemeField />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <UriLinksField />
          </div>
          <div className="column">
            <CoversField />
          </div>
        </div>

        <div className="actions columns is-gapless">
          <div className="column">
            <Button title="All good" icon="fas fa-check" onClick={closeModal} primary />
          </div>
        </div>

        {user && (
          <div className="reset has-text-grey-light">
            Logged in as {user.name}
            <Button
              title="Delete all data"
              icon="far fa-trash-alt"
              onClick={() => dispatch(showResetModal())}
              small
            />
          </div>
        )}

        <Credits />
      </div>
    </div>
  )
}

export default SettingsModal
