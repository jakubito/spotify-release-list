import { useSelector, useDispatch } from 'react-redux'
import { ReleasesOrderLabels } from 'enums'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Select } from 'components/common'

/**
 * Render releases order field
 */
function ReleasesOrderField() {
  const { releasesOrder } = useSelector(getSettings)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLSelectElement>} */
  const onChange = (event) => {
    const newValue = /** @type {ReleasesOrder} */ (event.target.value)
    defer(dispatch, setSettings({ releasesOrder: newValue }))
  }

  return (
    <div className="ReleasesOrderField Settings__field field">
      <label className="label has-text-light" htmlFor="releasesOrder">
        Order releases by
      </label>
      <Select
        id="releasesOrder"
        icon="fas fa-sort-alpha-down"
        defaultValue={releasesOrder}
        onChange={onChange}
        options={ReleasesOrderLabels}
      />
    </div>
  )
}

export default ReleasesOrderField
