import { useSelector, useDispatch } from 'react-redux'
import { getSettingsTheme } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Theme } from 'enums'
import { Select } from 'components/common'

const { COMPACT, SINGLE_COLUMN } = Theme

/** @type {SelectOptions} */
const options = [
  [COMPACT, 'Compact (Default)'],
  [[SINGLE_COLUMN, COMPACT].join(' '), 'Single Column - Compact'],
  ['', 'Original'],
  [SINGLE_COLUMN, 'Single Column - Original'],
]

/**
 * Render theme selection field
 */
function ThemeField() {
  const theme = useSelector(getSettingsTheme)
  const dispatch = useDispatch()

  return (
    <div className="ThemeField Settings__field field">
      <label className="label has-text-light" htmlFor="theme">
        Layout
      </label>
      <Select
        id="theme"
        icon="fas fa-palette"
        defaultValue={theme}
        onChange={(event) => defer(dispatch, setSettings({ theme: event.target.value }))}
        options={options}
      />
    </div>
  )
}

export default ThemeField
