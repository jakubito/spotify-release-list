import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import prettyBytes from 'pretty-bytes'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer, sleep } from 'helpers'
import * as history from 'history'
import { Button, Checkbox } from 'components/common'
import HelpText from './HelpText'

function HistoryField() {
  const { autoHistoryUpdate } = useSelector(getSettings)
  const dispatch = useDispatch()
  const [size, setSize] = useState(0)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    history.size().then(setSize)
  }, [])

  const clearHistory = () => {
    history.clear()
    setCleared(true)
    setSize(0)
    sleep(1200).then(() => setCleared(false))
  }

  return (
    <div className="HistoryField Settings__field field">
      <label className="label has-text-light" htmlFor="autoHistoryUpdate">
        Album history
      </label>
      <div className="Settings__help">
        <HelpText>
          If enabled, all newly fetched albums will be automatically added to the local history
          data. This will hide them on subsequent refreshes, making it easier to see what's new.
        </HelpText>
      </div>
      <div className="control">
        <div className="field">
          <Checkbox
            id="autoHistoryUpdate"
            label="Update album history on refresh"
            defaultChecked={autoHistoryUpdate}
            onChange={(event) =>
              defer(dispatch, setSettings({ autoHistoryUpdate: event.target.checked }))
            }
          />
        </div>
      </div>
      <Button
        title={
          cleared ? 'Album history cleared' : `Clear album history (${prettyBytes(size)} used)`
        }
        icon={cleared && 'fas fa-check-circle'}
        disabled={cleared}
        onClick={clearHistory}
        small
      />
    </div>
  )
}

export default HistoryField
