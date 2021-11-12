import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { defer, deferred } from 'helpers'
import { setFilters } from 'state/actions'
import { getFiltersSearch } from 'state/selectors'
import { Input, Button } from 'components/common'

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

  useEffect(() => setValue(filtersSearch), [filtersSearch])
  useEffect(
    deferred(() => inputRef.current?.focus()),
    []
  )

  return (
    <div className="SearchFilter Filters__filter">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search artists and releases"
        ref={inputRef}
      />
      {filtersSearch && <Button title="Reset" className="reset" onClick={reset} text />}
    </div>
  )
}

export default SearchFilter
