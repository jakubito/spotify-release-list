import { useSelector, useDispatch } from 'react-redux'
import { getFavoriteLabels } from 'state/selectors'
import { removeFavoriteLabel } from 'state/actions'
import { Button } from 'components/common'

/**
 * Display and manage favorite labels
 */
function FavoriteLabels({ onLabelSelect }) {
  const dispatch = useDispatch()
  const favoriteLabels = useSelector(getFavoriteLabels)

  const handleRemoveFavorite = (labelName, event) => {
    event.stopPropagation()
    dispatch(removeFavoriteLabel(labelName))
  }

  const handleLabelClick = (labelName) => {
    onLabelSelect(labelName)
  }

  if (favoriteLabels.length === 0) {
    return null
  }

  return (
    <div className="FavoriteLabels">
      <h4 className="FavoriteLabels__title">Favorite Labels</h4>
      <div className="FavoriteLabels__list">
        {favoriteLabels.map((labelName) => (
          <div key={labelName} className="FavoriteLabels__item">
            <button
              className="FavoriteLabels__button"
              onClick={() => handleLabelClick(labelName)}
              type="button"
            >
              {labelName}
            </button>
            <button
              className="FavoriteLabels__remove"
              onClick={(event) => handleRemoveFavorite(labelName, event)}
              title="Remove from favorites"
              type="button"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoriteLabels