import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Input } from 'components/common'
import HelpText from './HelpText'

/**
 * 24-hour clock regex
 */
const TIME_REGEX = /^(2[0-3]|[01][0-9]):([0-5][0-9])$/

/**
 * Render auto sync time field
 */
function AutoSyncTimeField() {
  const dispatch = useDispatch()
  const { autoSyncTime } = useSelector(getSettings)
  const { register, formState, watch } = useForm({ mode: 'onChange' })
  const value = watch('autoSyncTime')
  const error = formState.errors.autoSyncTime

  useEffect(() => {
    if (value && !error) {
      defer(dispatch, setSettings({ autoSyncTime: value }))
    }
  }, [value, error])

  return (
    <div className="AutoSyncTimeField Settings__field field">
      <label className="label has-text-light" htmlFor="autoSyncTime">
        Trigger at <HelpText>(approximately)</HelpText>
      </label>
      <div className="control">
        <div className="field">
          <Input
            id="autoSyncTime"
            type="time"
            defaultValue={autoSyncTime}
            className={classNames({ 'is-danger': error })}
            placeholder="HH:MM (24-hour clock)"
            {...register('autoSyncTime', { required: true, pattern: TIME_REGEX })}
          />
        </div>
      </div>
    </div>
  )
}

export default AutoSyncTimeField
