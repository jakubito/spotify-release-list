import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Select } from 'components/common'

/** @type {SelectOptions} */
const options = [
  ['0', 'Sunday'],
  ['1', 'Monday'],
  ['2', 'Tuesday'],
  ['3', 'Wednesday'],
  ['4', 'Thursday'],
  ['5', 'Friday'],
  ['6', 'Saturday'],
]

/**
 * Render first day of week field
 */
function FirstDayOfWeekField() {
  const { firstDayOfWeek } = useSelector(getSettings)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLSelectElement>} */
  const onChange = (event) => {
    const newValue = /** @type {DayOfWeekShape} */ (Number(event.target.value))
    defer(dispatch, setSettings({ firstDayOfWeek: newValue }))
  }

  return (
    <div className="FirstDayOfWeekField Settings__field field">
      <label className="label has-text-light" htmlFor="firstDayOfWeek">
        Start week on
      </label>
      <Select
        id="firstDayOfWeek"
        icon="fas fa-calendar-week"
        defaultValue={firstDayOfWeek.toString()}
        onChange={onChange}
        options={options}
      />
    </div>
  )
}

export default FirstDayOfWeekField
