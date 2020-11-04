import React, { useState } from 'react'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'
import { defer } from 'helpers'
import SelectionEntries from './SelectionEntries'

const { RELEASES, SELECTED_RELEASES } = FieldName

/**
 * Render playlist album selection field
 */
function SelectionField() {
  const { watch, errors } = useFormContext()
  const [expanded, setExpanded] = useState(false)

  const releases = watch(RELEASES)
  const selectedReleases = watch(SELECTED_RELEASES)

  if (!releases || !selectedReleases || releases.length === 0) {
    return null
  }

  return (
    <div className="SelectionField field">
      <button
        type="button"
        className={classNames('button is-dark is-rounded is-fullwidth has-text-weight-semibold', {
          'is-darker': !expanded,
        })}
        onClick={() =>
          defer(
            setExpanded,
            /** @type {React.SetStateAction<boolean>} */
            ((currentExpanded) => !currentExpanded)
          )
        }
      >
        <span>
          {expanded ? 'Collapse' : 'Expand'} selection ({selectedReleases.size})
        </span>
        <span className="icon" key={Number(expanded)}>
          <i
            className={classNames('fas', {
              'fa-caret-up': expanded,
              'fa-caret-down': !expanded,
            })}
          />
        </span>
      </button>

      {expanded && <SelectionEntries />}

      {errors[SELECTED_RELEASES] && <p className="help is-danger">No releases selected.</p>}
    </div>
  )
}

export default SelectionField
