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

  if (favoriteLabels.length === 0) {
    return null
  }

  return (
    <div className="FavoriteLabels">
      <h4 className="FavoriteLabels__title">Favorite Labels</h4>
      <div className="FavoriteLabels__list">
        {favoriteLabels.map((labelName) => (
          <div key={labelName} className="FavoriteLabels__item">
            <Button
              title={labelName}
              onClick={() => onLabelSelect(labelName)}
              className="FavoriteLabels__button"
              text
            >
              {labelName}
            </Button>
            <Button
              title="Remove from favorites"
              icon="fas fa-times"
              onClick={(event) => handleRemoveFavorite(labelName, event)}
              className="FavoriteLabels__remove"
              text
              small
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoriteLabels