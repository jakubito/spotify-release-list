import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { defer } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersMaxTracks, getFiltersMinTracks } from 'state/selectors'
import { Input, Button } from 'components/common'

/**
 * @param {string} value
 * @returns {number | null}
 */
const parseCount = (value) => {
  const count = parseInt(value, 10)
  return count > 0 ? count : null
}

/**
 * Render min / max tracks count filter
 */
function TracksCountFilter() {
  const dispatch = useDispatch()
  const minTracks = useSelector(getFiltersMinTracks)
  const maxTracks = useSelector(getFiltersMaxTracks)
  const [values, setValues] = useState({
    minTracks: String(minTracks ?? ''),
    maxTracks: String(maxTracks ?? ''),
  })

  const debouncedDispatch = useCallback(
    debounce(
      /** @param {typeof values} next */
      (next) =>
        dispatch(
          setFilters({
            minTracks: parseCount(next.minTracks),
            maxTracks: parseCount(next.maxTracks),
          })
        ),
      300
    ),
    []
  )

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const next = { ...values, [event.target.name]: event.target.value }
    setValues(next)
    debouncedDispatch(next)
  }

  const reset = () => {
    debouncedDispatch.cancel()
    setValues({ minTracks: '', maxTracks: '' })
    defer(dispatch, setFilters({ minTracks: null, maxTracks: null }))
  }

  useEffect(
    () => setValues({ minTracks: String(minTracks ?? ''), maxTracks: String(maxTracks ?? '') }),
    [minTracks, maxTracks]
  )

  return (
    <div className="TracksCountFilter Filters__filter">
      <Input
        type="number"
        name="minTracks"
        value={values.minTracks}
        onChange={onChange}
        placeholder="Min tracks #"
        min={1}
      />
      <Input
        type="number"
        name="maxTracks"
        value={values.maxTracks}
        onChange={onChange}
        placeholder="Max tracks #"
        min={1}
      />
      {(minTracks || maxTracks) && <Button title="Reset" className="reset" onClick={reset} text />}
    </div>
  )
}

export default TracksCountFilter
