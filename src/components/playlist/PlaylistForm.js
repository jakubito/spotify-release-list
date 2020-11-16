import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { getWorking } from 'state/selectors'
import Button from 'components/Button'
import { NameField, DescriptionField, VisibilityField } from '.'

/**
 * Render playlist form
 *
 * @param {{ submitTriggered: boolean, closeModal: () => void }} props
 */
function PlaylistForm({ submitTriggered, closeModal }) {
  const working = useSelector(getWorking)

  return (
    <>
      <div className="PlaylistForm">
        <NameField />
        <DescriptionField />
        <VisibilityField />
      </div>

      <div className="actions columns is-gapless">
        <div className="column">
          <Button
            type="submit"
            title="Create"
            icon="fas fa-asterisk"
            className={classNames({ 'is-loading': submitTriggered })}
            disabled={working || submitTriggered}
            key="submit"
            primary
          />
        </div>

        <div className="column has-text-right">
          <Button
            title="Close"
            icon="fas fa-times"
            onClick={closeModal}
            disabled={submitTriggered}
          />
        </div>
      </div>
    </>
  )
}

export default PlaylistForm
