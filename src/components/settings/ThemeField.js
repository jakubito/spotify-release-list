import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getSettingsTheme } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Theme } from 'enums'

const { COMPACT, SINGLE_COLUMN } = Theme

/**
 * Render theme selection field
 */
function ThemeField() {
  const theme = useSelector(getSettingsTheme)
  const dispatch = useDispatch()

  useEffect(() => {
    const { classList } = document.documentElement

    classList.remove(...Object.values(Theme))

    if (theme) {
      classList.add(...theme.split(' '))
    }
  }, [theme])

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor="theme">
        Theme
      </label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select
            id="theme"
            defaultValue={theme}
            onChange={(event) => defer(dispatch, setSettings({ theme: event.target.value }))}
          >
            <option value="">Default</option>
            <option value={COMPACT}>Compact</option>
            <option value={SINGLE_COLUMN}>Single Column</option>
            <option value={[SINGLE_COLUMN, COMPACT].join(' ')}>Single Column - Compact</option>
          </select>
        </div>
        <span className="icon is-left">
          <i className="fas fa-palette" />
        </span>
      </div>
    </div>
  )
}

export default ThemeField
