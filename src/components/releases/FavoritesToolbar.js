import { useDispatch, useSelector } from 'react-redux'
import { getEditingFavorites, getHasReleases } from 'state/selectors'
import { Button } from 'components/common'
import { deferred } from 'helpers'
import { setFavoriteAll, setFavoriteNone } from 'state/actions'

/**
 * Render favorites edit mode toolbar
 *
 * @param {{ resetList: () => void }} props
 */
function FavoritesToolbar({ resetList }) {
  const dispatch = useDispatch()
  const editingFavorites = useSelector(getEditingFavorites)
  const hasReleases = useSelector(getHasReleases)

  const addAll = deferred(() => {
    resetList()
    dispatch(setFavoriteAll())
  })

  const removeAll = deferred(() => {
    resetList()
    dispatch(setFavoriteNone())
  })

  if (!editingFavorites) return null
  if (!hasReleases) return null

  return (
    <div className="FavoritesToolbar">
      <Button title="Add all" icon="fas fa-check" onClick={addAll} darker small />
      <Button title="Remove all" icon="fas fa-times" onClick={removeAll} darker small />
    </div>
  )
}

export default FavoritesToolbar
