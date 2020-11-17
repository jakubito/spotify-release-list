import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { defer } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersSearch } from 'state/selectors'
import Input from 'components/Input'
import Button from 'components/Button'

/**
 * Render full-text search filter
 */
function SearchFilter() {
  const dispatch = useDispatch()
  const filtersSearch = useSelector(getFiltersSearch)
  const [value, setValue] = useState(filtersSearch)
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputRef = useRef()

  const debouncedDispatch = useCallback(
    debounce(
      /** @param {string} search */
      (search) => dispatch(setFilters({ search })),
      300
    ),
    []
  )

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    setValue(event.target.value)
    debouncedDispatch(event.target.value.trim())
  }

  const reset = () => {
    setValue('')
    defer(dispatch, setFilters({ search: '' }))
  }

  useEffect(() => defer(() => inputRef.current?.focus()), [])

  return (
    <div className="SearchFilter filter">
      <Input value={value} onChange={onChange} placeholder="Search" ref={inputRef} />
      {filtersSearch && <Button title="Reset" className="reset" onClick={reset} text />}
    </div>
  )
}

export default SearchFilter
