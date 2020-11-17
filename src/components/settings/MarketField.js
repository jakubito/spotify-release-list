import { useSelector, useDispatch } from 'react-redux'
import { Market } from 'enums'
import { getSettingsMarket } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import HelpText from './HelpText'

/**
 * Render market selection field
 */
function MarketField() {
  const market = useSelector(getSettingsMarket)
  const dispatch = useDispatch()

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor="market">
        Market country <HelpText>/ prevent duplicates</HelpText>
      </label>
      <div className="control has-icons-left">
        <div className="select is-rounded">
          <select
            id="market"
            defaultValue={market}
            onChange={(event) => defer(dispatch, setSettings({ market: event.target.value }))}
          >
            <option value="">All markets</option>
            {Object.entries(Market).map(([code, name]) => (
              <option value={code} key={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <span className="icon is-left">
          <i className="fas fa-globe" />
        </span>
      </div>
    </div>
  )
}

export default MarketField
