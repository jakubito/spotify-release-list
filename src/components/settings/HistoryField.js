import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import prettyBytes from 'pretty-bytes'
import { getSettings } from 'state/selectors'
import { setFilters, setSettings } from 'state/actions'
import { defer, sleep } from 'helpers'
import { albumsNew, albumsHistory } from 'albums'
import { Button, Checkbox } from 'components/common'
import HelpText from './HelpText'

function HistoryField() {
  const { trackHistory } = useSelector(getSettings)
  const dispatch = useDispatch()
  const [cleared, setCleared] = useState(false)
  const size = albumsNew.size + albumsHistory.size
  const clearTitle = cleared
    ? 'Album history cleared'
    : `Clear album history (${prettyBytes(size)} used)`

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    defer(dispatch, setSettings({ trackHistory: event.target.checked }))
    defer(dispatch, setFilters({ newOnly: false }))
  }

  const clearHistory = () => {
    albumsNew.clear()
    albumsHistory.clear()
    setCleared(true)
    sleep(1200).then(() => setCleared(false))
  }

  return (
    <div className="HistoryField Settings__field field">
      <label className="label has-text-light" htmlFor="trackHistory">
        Album history
      </label>
      <div className="Settings__help">
        <HelpText>
          Tracking album history enables{' '}
          <strong>
            <i className="fas fa-star fa-xs" style={{ marginRight: 4 }} />
            New
          </strong>{' '}
          filter, which shows newly released albums since the last refresh. This filter will be
          automatically turned on in case there are new albums to show.
        </HelpText>
      </div>
      <div className="control">
        <div className="field">
          <Checkbox
            id="trackHistory"
            label="Track album history"
            defaultChecked={trackHistory}
            onChange={onChange}
          />
        </div>
      </div>
      <Button
        title={clearTitle}
        icon={cleared && 'fas fa-check-circle'}
        disabled={cleared}
        onClick={clearHistory}
        small
      />
    </div>
  )
}

export default HistoryField
