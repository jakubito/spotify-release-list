import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { getFiltersFavoritesOnly } from 'state/selectors'
import { setFilters } from 'state/actions'
import { deferred } from 'helpers'
import { Button } from 'components/common'

/**
 * Render favorites only filter
 */
function FavoritesFilter() {
  const dispatch = useDispatch()
  const favoritesOnly = useSelector(getFiltersFavoritesOnly)
  const [selected, setSelected] = useState(favoritesOnly)

  useEffect(deferred(dispatch, setFilters({ favoritesOnly: selected })), [selected])

  return (
    <Button
      title="Favorites"
      icon="fas fa-heart"
      className={classNames('group', { active: favoritesOnly })}
      onClick={() => setSelected(!selected)}
    />
  )
}

export default FavoritesFilter
