import { Theme } from 'enums'

/**
 * Persist theme to document on every change
 *
 * @param {SetSettingsAction} action
 */
export function themeUpdateSaga(action) {
  const { classList } = document.documentElement
  const { theme } = action.payload

  if (theme === undefined) return

  classList.remove(...Object.values(Theme))

  if (theme) {
    classList.add(...theme.split(' '))
  }
}
