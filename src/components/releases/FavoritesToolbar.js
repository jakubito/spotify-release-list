import { useDispatch, useSelector } from 'react-redux'
import { getEditingFavorites, getHasReleases } from 'state/selectors'
import { Button } from 'components/common'
import { deferred } from 'helpers'
import { setFavoriteAll, setFavoriteNone } from 'state/actions'

/**
 * Render favorites edit mode toolbar
 */
function FavoritesToolbar() {
  const dispatch = useDispatch()
  const editingFavorites = useSelector(getEditingFavorites)
  const hasReleases = useSelector(getHasReleases)

  if (!editingFavorites) return null
  if (!hasReleases) return null

  return (
    <div className="FavoritesToolbar">
      <Button
        title="Add all"
        icon="fas fa-check"
        onClick={deferred(dispatch, setFavoriteAll())}
        darker
        small
      />
      <Button
        title="Remove all"
        icon="fas fa-times"
        onClick={deferred(dispatch, setFavoriteNone())}
        darker
        small
      />
    </div>
  )
}

export default FavoritesToolbar
