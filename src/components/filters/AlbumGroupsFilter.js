import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import xor from 'lodash/xor'
import { deferred } from 'helpers'
import { AlbumGroupLabels } from 'enums'
import { getFiltersGroups, getReleasesGroupMap, getSettings } from 'state/selectors'
import { setFilters } from 'state/actions'
import { Button } from 'components/common'
import NewFilter from './NewFilter'
import FavoritesFilter from './FavoritesFilter'

/**
 * Render album groups filter
 */
function AlbumGroupsFilter() {
  const dispatch = useDispatch()
  const releasesGroupMap = useSelector(getReleasesGroupMap)
  const filtersGroups = useSelector(getFiltersGroups)
  const { trackHistory } = useSelector(getSettings)
  const [values, setValues] = useState(filtersGroups)
  const groupsToRender = AlbumGroupLabels.filter(([group]) => group in releasesGroupMap)

  useEffect(deferred(dispatch, setFilters({ groups: values })), [values])
  useEffect(() => setValues(filtersGroups), [filtersGroups])

  if (Object.keys(releasesGroupMap).length === 1) {
    return null
  }

  return (
    <div className="AlbumGroupsFilter Filters__filter">
      {trackHistory && <NewFilter />}
      <FavoritesFilter />
      {groupsToRender.map(([group, label]) => (
        <Button
          title={label}
          className={classNames('group', { active: values.includes(group) })}
          onClick={() => setValues((current) => xor(current, [group]))}
          key={group}
        />
      ))}
      {Boolean(filtersGroups.length) && (
        <Button title="Reset" className="reset" onClick={() => setValues([])} text />
      )}
    </div>
  )
}

export default AlbumGroupsFilter
