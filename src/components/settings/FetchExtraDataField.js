import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Checkbox } from 'components/common'
import HelpText from './HelpText'

/**
 * Render fetch extra data toggle field
 */
function FetchExtraDataField() {
  const { fullAlbumData } = useSelector(getSettings)
  const dispatch = useDispatch()
  const location = useLocation()
  const [highlighted, setHighlighted] = useState(false)
  /** @type {React.RefObject<HTMLInputElement | null>} */
  const checkboxRef = useRef(null)

  useEffect(() => {
    if (location.hash !== '#fetchExtraData') return
    checkboxRef.current?.scrollIntoView({ block: 'center' })
    checkboxRef.current?.focus({ preventScroll: true })
    setHighlighted(true)
  }, [location])

  return (
    <div className="FetchExtraDataField Settings__field field">
      <label className="label has-text-light" htmlFor="fetchExtraData">
        Fetch extra album data <HelpText>(faster when turned off)</HelpText>
      </label>
      <div className="control">
        <div
          className={classNames('field', { FetchExtraDataField__highlight: highlighted })}
          onAnimationEnd={() => setHighlighted(false)}
        >
          <Checkbox
            ref={checkboxRef}
            id="fetchExtraData"
            label="Fetch label and popularity data"
            defaultChecked={fullAlbumData}
            labelStyle={{ marginRight: 0 }}
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
