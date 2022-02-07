import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { useFeature } from 'hooks'
import { Checkbox } from 'components/common'

/**
 * Render album meta field
 */
function MetaField() {
  const { displayLabels, displayPopularity, displayTracks, fullAlbumData } =
    useSelector(getSettings)
  const dispatch = useDispatch()
  const { seen: labelsFeatureSeen } = useFeature('labels')

  return (
    <div className="MetaField Settings__field field">
      <label className="label has-text-light">Album meta data</label>
      <div className="control">
        <div className="field">
          <Checkbox
            id="displayLabels"
            label={
              <>
                Display label
                {!labelsFeatureSeen && (
                  <div className="badge badge--inline badge--primary">NEW</div>
                )}
              </>
            }
            defaultChecked={displayLabels}
            onChange={(event) =>
              defer(dispatch, setSettings({ displayLabels: event.target.checked }))
            }
          />
          {!fullAlbumData && <span className="tag is-warning">Label data required</span>}
        </div>
      </div>
      <div className="control">
        <div className="field">
          <Checkbox
            id="displayPopularity"
            label={
              <>
                Display popularity value
                {!labelsFeatureSeen && (
                  <div className="badge badge--inline badge--primary">NEW</div>
                )}
              </>
            }
            defaultChecked={displayPopularity}
            onChange={(event) =>
              defer(dispatch, setSettings({ displayPopularity: event.target.checked }))
            }
          />
          {!fullAlbumData && <span className="tag is-warning">Popularity data required</span>}
        </div>
      </div>
      <div className="control">
        <div className="field">
          <Checkbox
            id="displayTracks"
            label="Display number of tracks"
            defaultChecked={displayTracks}
            onChange={(event) =>
              defer(dispatch, setSettings({ displayTracks: event.target.checked }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default MetaField
