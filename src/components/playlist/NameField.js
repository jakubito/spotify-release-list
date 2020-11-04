import React from 'react'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'

const { NAME, NAME_CUSTOM } = FieldName

/**
 * Render playlist name form field
 */
function NameField() {
  const { register, errors, setValue } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light">Name</label>
      <div className="control">
        <input
          name={NAME}
          className={classNames('input is-rounded', { 'is-danger': errors[NAME] })}
          type="text"
          onChange={() => setValue(NAME_CUSTOM, true)}
          ref={register({ required: true, maxLength: 100 })}
        />
      </div>
      {errors[NAME] && (
        <p className="help is-danger">
          {errors[NAME].type === 'required' && 'Name is required.'}
          {errors[NAME].type === 'maxLength' && "Name can't exceed 100 characters."}
        </p>
      )}
    </div>
  )
}

export default NameField
