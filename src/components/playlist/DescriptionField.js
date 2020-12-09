import { useFormContext } from 'react-hook-form'
import { Input } from 'components/common'

/**
 * Render playlist description form field
 */
function DescriptionField() {
  const { register, errors } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor="description">
        Description
      </label>
      <div className="control">
        <Input
          id="description"
          name="description"
          placeholder="Optional"
          ref={register({ maxLength: 100 })}
        />
      </div>
      {errors.description && (
        <p className="help is-danger">Description can&apos;t exceed 300 characters.</p>
      )}
    </div>
  )
}

export default DescriptionField
