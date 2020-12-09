import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { playlistName } from 'helpers'
import { getFiltersDates } from 'state/selectors'
import { Input } from 'components'

/**
 * Render playlist name form field
 */
function NameField() {
  const filtersDates = useSelector(getFiltersDates)
  const { register, errors } = useFormContext()
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor="name">
        Playlist name
      </label>
      <div className="control">
        <Input
          id="name"
          name="name"
          defaultValue={filtersDates && playlistName(filtersDates.startDate, filtersDates.endDate)}
          className={classNames({ 'is-danger': errors.name })}
          ref={(element) => {
            register(element, { required: true, maxLength: 100 })
            inputRef.current = element
          }}
        />
      </div>
      {errors.name && (
        <p className="help is-danger">
          {errors.name.type === 'required' && 'Name is required.'}
          {errors.name.type === 'maxLength' && "Name can't exceed 100 characters."}
        </p>
      )}
    </div>
  )
}

export default NameField
