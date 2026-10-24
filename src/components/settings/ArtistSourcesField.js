import xor from 'lodash/xor'
import { useSelector, useDispatch } from 'react-redux'
import { ArtistSourceLabels } from 'enums'
import { getSettingsArtistSources } from 'state/selectors'
import { setSettings } from 'state/actions'
import { Checkbox } from 'components/common'
import HelpText from './HelpText'

/**
 * Render artist source selection field
 */
function ArtistSourcesField() {
  const artistSources = useSelector(getSettingsArtistSources)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newValue = xor(artistSources, [/**@type {ArtistSource} */ (event.target.value)])
    dispatch(setSettings({ artistSources: newValue }))
  }

  return (
    <div className="ArtistSourcesField Settings__field field">
      <label className="label has-text-light">
        Include artists from <HelpText>(huge impact on loading time)</HelpText>
      </label>
      <div className="control">
        {ArtistSourceLabels.map(([source, label]) => (
          <div className="field" key={source}>
            <Checkbox
              id={`artistSource_${source}`}
              label={label}
              value={source}
              checked={artistSources.includes(source)}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
      {artistSources.length === 0 && (
        <p className="help is-danger">Select at least one source to load releases.</p>
      )}
    </div>
  )
}

export default ArtistSourcesField
