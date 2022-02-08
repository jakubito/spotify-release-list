import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { useFeature } from 'hooks'
import { Checkbox } from 'components/common'
import HelpText from './HelpText'

/**
 * Render fetch extra data toggle field
 */
function FetchExtraDataField() {
  const { fullAlbumData } = useSelector(getSettings)
  const dispatch = useDispatch()
  const { seen: labelsFeatureSeen } = useFeature('labels')

  return (
    <div className="FetchExtraDataField Settings__field field">
      <label className="label has-text-light" htmlFor="fetchExtraData">
        Fetch extra album data <HelpText>(faster when turned off)</HelpText>
        {!labelsFeatureSeen && <div className="badge badge--inline badge--info">NEW</div>}
      </label>
      <div className="control">
        <div className="field">
          <Checkbox
            id="fetchExtraData"
            label="Fetch label and popularity data"
            defaultChecked={fullAlbumData}
            onChange={(event) =>
              defer(dispatch, setSettings({ fullAlbumData: event.target.checked }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default FetchExtraDataField
