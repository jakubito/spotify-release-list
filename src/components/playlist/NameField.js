import React from 'react'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'

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
          name={FieldName.NAME}
          className={classNames('input is-rounded', { 'is-danger': errors[FieldName.NAME] })}
          type="text"
          onChange={() => setValue(FieldName.NAME_CUSTOM, true)}
          ref={register({ required: true, maxLength: 100 })}
        />
      </div>
      {errors[FieldName.NAME] && (
        <p className="help is-danger">
          {errors[FieldName.NAME].type === 'required' && 'Name is required.'}
          {errors[FieldName.NAME].type === 'maxLength' && "Name can't exceed 100 characters."}
        </p>
      )}
    </div>
  )
}

export default NameField
