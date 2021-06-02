import { useDispatch } from 'react-redux'
import random from 'lodash/random'
import { GroupColorSchemes } from 'enums'
import { deferred, randomColorScheme } from 'helpers'
import { setSettings } from 'state/actions'
import { Button } from 'components/common'

const { DEFAULT, ORIGINAL, WHITE } = GroupColorSchemes

/**
 * Color scheme shortcuts definition
 *
 * @type {{ label: string, scheme: () => GroupColorScheme }[]}
 */
const shortcuts = [
  { label: 'Default', scheme: () => DEFAULT },
  { label: 'Original', scheme: () => ORIGINAL },
  { label: 'High contrast', scheme: () => WHITE },
  {
    label: 'Random',
    scheme: () =>
      randomColorScheme({
        rotation: () => random(60, 80),
        saturation: () => random(70, 80),
        lightness: () => random(65, 70),
      }),
  },
  {
    label: 'Random pastel',
    scheme: () =>
      randomColorScheme({
        rotation: () => random(60, 80),
        saturation: () => random(75, 80),
        lightness: () => random(80, 85),
      }),
  },
]

/**
 * Render group color scheme shortcuts
 */
function GroupColorsShortcuts() {
  const dispatch = useDispatch()

  return (
    <div className="GroupColorsShortcuts">
      {shortcuts.map(({ label, scheme }) => (
        <Button
          title={label}
          className="GroupColorsShortcuts__button"
          onClick={deferred(dispatch, setSettings({ groupColors: scheme() }))}
          key={label}
          text
          dark
          small
        />
      ))}
    </div>
  )
}

export default GroupColorsShortcuts
