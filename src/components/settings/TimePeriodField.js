import { useSelector, useDispatch } from 'react-redux'
import { getSettingsDays } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Select } from 'components/common'
import HelpText from './HelpText'

/** @type {SelectOptions} */
const options = [
  ['7', 'Past week'],
  ['30', 'Past month'],
  ['90', 'Past 3 months'],
  ['180', 'Past 6 months'],
  ['365', 'Past year'],
]

/**
 * Render time period field
 */
function TimePeriodField() {
  const days = useSelector(getSettingsDays)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLSelectElement>} */
  const onChange = (event) => defer(dispatch, setSettings({ days: Number(event.target.value) }))

  return (
    <div className="TimePeriodField Settings__field field">
      <label className="label has-text-light" htmlFor="timePeriod">
        Time period <HelpText>(affects local storage usage)</HelpText>
      </label>
      <Select
        id="timePeriod"
        icon="fas fa-history"
        defaultValue={days.toString()}
        onChange={onChange}
        options={options}
      />
    </div>
  )
}

export default TimePeriodField
