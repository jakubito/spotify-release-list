import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getSettingsTheme } from 'selectors'
import { setSettings } from 'actions'
import { defer } from 'helpers'
import { Theme } from 'enums'

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
      <label className="label has-text-light">Theme</label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select
            defaultValue={theme}
            onChange={(event) => defer(dispatch, setSettings({ theme: event.target.value }))}
          >
            <option value="">Default</option>
            <option value={Theme.COMPACT}>Compact</option>
            <option value={Theme.SINGLE_COLUMN}>Single Column</option>
            <option value={[Theme.SINGLE_COLUMN, Theme.COMPACT].join(' ')}>
              Single Column - Compact
            </option>
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
