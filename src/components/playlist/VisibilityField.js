import { useFormContext } from 'react-hook-form'

/**
 * Render playlist visibility form field
 */
function VisibilityField() {
  const { register } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light">Add to profile</label>
      <div className="control">
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="visibilityPrivate"
            type="radio"
            value="private"
            defaultChecked
            {...register('visibility')}
          />
          <label htmlFor="visibilityPrivate">No</label>
        </div>
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="visibilityPublic"
            type="radio"
            value="public"
            {...register('visibility')}
          />
          <label htmlFor="visibilityPublic">Yes</label>
        </div>
      </div>
    </div>
  )
}

export default VisibilityField
