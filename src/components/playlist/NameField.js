import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { FieldName } from 'enums'
import { getPlaylistNameSuggestion } from 'helpers'
import { getFiltersDates } from 'state/selectors'
import Input from 'components/Input'

const { NAME } = FieldName

/**
 * Render playlist name form field
 */
function NameField() {
  const { startDate, endDate } = useSelector(getFiltersDates) || {}
  const { register, errors } = useFormContext()
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor={NAME}>
        Name
      </label>
      <div className="control">
        <Input
          id={NAME}
          name={NAME}
          defaultValue={getPlaylistNameSuggestion(startDate, endDate)}
          className={classNames({ 'is-danger': errors[NAME] })}
          ref={(element) => {
            register(element, { required: true, maxLength: 100 })
            inputRef.current = element
          }}
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
