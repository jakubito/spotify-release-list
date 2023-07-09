import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { getFiltersNewOnly } from 'state/selectors'
import { setFilters } from 'state/actions'
import { deferred } from 'helpers'
import { Button } from 'components/common'

function NewFilter() {
  const dispatch = useDispatch()
  const newOnly = useSelector(getFiltersNewOnly)
  const [selected, setSelected] = useState(newOnly)

  useEffect(deferred(dispatch, setFilters({ newOnly: selected })), [selected])
  useEffect(() => setSelected(newOnly), [newOnly])

  return (
    <Button
      title="New"
      icon="fas fa-star"
      className={classNames('group', { active: selected })}
      onClick={() => setSelected(!selected)}
    />
  )
}

export default NewFilter
