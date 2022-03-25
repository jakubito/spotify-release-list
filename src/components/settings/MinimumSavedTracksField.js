import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { ArtistSource } from 'enums'
import { Input } from 'components/common'

/**
 * Render minimum saved tracks field
 */
function MinimumSavedTracksField() {
  const { artistSources, minimumSavedTracks } = useSelector(getSettings)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newValue = Math.max(1, Math.floor(Number(event.target.value)))
    defer(dispatch, setSettings({ minimumSavedTracks: newValue }))
  }

  if (!artistSources.includes(ArtistSource.SAVED_TRACKS)) return null

  return (
    <div className="MinimumSavedTracksField Settings__field field">
      <label className="label has-text-light" htmlFor="minimumSavedTracks">
        Require a minimum number of songs liked
      </label>
      <div className="control">
        <div className="field">
          <Input
            id="minimumSavedTracks"
            type="number"
            className="MinimumSavedTracksField__input"
            step="1"
            pattern="\d*"
            defaultValue={String(minimumSavedTracks)}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export default MinimumSavedTracksField
