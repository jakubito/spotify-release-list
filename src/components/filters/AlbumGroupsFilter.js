import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import xor from 'lodash/xor'
import { deferred } from 'helpers'
import { AlbumGroupLabels } from 'enums'
import { getFiltersGroups, getReleasesGroupMap } from 'state/selectors'
import { setFilters } from 'state/actions'
import { Button } from 'components/common'
import FavoritesFilter from './FavoritesFilter'

/**
 * Render album groups filter
 */
function AlbumGroupsFilter() {
  const dispatch = useDispatch()
  const releasesGroupMap = useSelector(getReleasesGroupMap)
  const filtersGroups = useSelector(getFiltersGroups)
  const [values, setValues] = useState(filtersGroups)

  useEffect(deferred(dispatch, setFilters({ groups: values })), [values])

  if (Object.keys(releasesGroupMap).length === 1) {
    return null
  }

  return (
    <div className="AlbumGroupsFilter Filters__filter">
      <FavoritesFilter />
      {AlbumGroupLabels.filter(([group]) => releasesGroupMap[group]).map(([group, label]) => (
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
