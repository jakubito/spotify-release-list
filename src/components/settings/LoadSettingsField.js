import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import capitalize from 'lodash/capitalize'
import { defer, sleep } from 'helpers'
import { setSettings } from 'state/actions'
import { Button } from 'components/common'
import HelpText from './HelpText'

/**
 * Import settings from JSON
 *
 * @param {{ parse: SettingsParser }} props
 */
function LoadSettingsField({ parse }) {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const { register, handleSubmit, formState } = useForm({ defaultValues: { settingsJson: '' } })
  const error = formState.errors.settingsJson

  /** @param {{ settingsJson: string }} data */
  const onSubmit = (data) => {
    defer(dispatch, setSettings(parse(data.settingsJson)))
    setLoaded(true)
    sleep(1200).then(() => setLoaded(false))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="LoadSettingsField Settings__field field">
      <label className="label has-text-light" htmlFor="loadSettings">
        Import settings <HelpText>(paste below)</HelpText>
      </label>
      <div className="control">
        <textarea
          id="loadSettings"
          className={classNames('BackupSettings__textarea textarea is-dark is-family-code', {
            'is-danger': error,
          })}
          rows={8}
          {...register('settingsJson', {
            required: true,
            validate: (value) => (parse(value) ? true : capitalize(parse.message)),
          })}
        />
      </div>
      {error && (
        <p className="help is-danger">
          {error.type === 'required' && 'Please enter settings'}
          {error.type === 'validate' && error.message}
        </p>
      )}
      <Button
        type="submit"
        title={loaded ? 'Import successful' : 'Import'}
        icon={loaded ? 'fas fa-check-circle' : 'fas fa-file-import'}
        className="BackupSettings__button"
        disabled={loaded}
      />
    </form>
  )
}

export default LoadSettingsField
