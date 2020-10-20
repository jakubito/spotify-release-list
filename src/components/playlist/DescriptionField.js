import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'

function DescriptionField() {
  const { register, errors } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light">Description</label>
      <div className="control">
        <input
          name={FieldName.DESCRIPTION}
          className="input is-rounded"
          type="text"
          placeholder="Optional"
          ref={register({ maxLength: 100 })}
        />
      </div>
      {errors[FieldName.DESCRIPTION] && (
        <p className="help is-danger">Description can&apos;t exceed 300 characters.</p>
      )}
    </div>
  )
}

export default DescriptionField
