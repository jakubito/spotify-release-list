import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'
import Input from 'components/Input'

const { DESCRIPTION } = FieldName

/**
 * Render playlist description form field
 */
function DescriptionField() {
  const { register, errors } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor={DESCRIPTION}>
        Description
      </label>
      <div className="control">
        <Input
          id={DESCRIPTION}
          name={DESCRIPTION}
          placeholder="Optional"
          ref={register({ maxLength: 100 })}
        />
      </div>
      {errors[DESCRIPTION] && (
        <p className="help is-danger">Description can&apos;t exceed 300 characters.</p>
      )}
    </div>
  )
}

export default DescriptionField
