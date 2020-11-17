import { useFormContext } from 'react-hook-form'

/**
 * Render playlist visibility form field
 */
function VisibilityField() {
  const { register } = useFormContext()

  return (
    <div className="field">
      <label className="label has-text-light">Visibility</label>
      <div className="control">
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="visibilityPrivate"
            type="radio"
            name="visibility"
            value="private"
            ref={register}
            defaultChecked
          />
          <label htmlFor="visibilityPrivate">Private</label>
        </div>
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="visibilityPublic"
            type="radio"
            name="visibility"
            value="public"
            ref={register}
          />
          <label htmlFor="visibilityPublic">Public</label>
        </div>
      </div>
    </div>
  )
}

export default VisibilityField
