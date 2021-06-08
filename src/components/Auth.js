import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from '@reach/router'
import { authorize } from 'state/actions'
import { getCreatingPlaylist, getMessage, getSyncing } from 'state/selectors'
import { includesTruthy } from 'helpers'

/**
 * Authorization component that handles all OAuth redirects
 *
 * @param {RouteComponentProps} props
 */
function Auth({ location }) {
  const dispatch = useDispatch()
  const shouldRedirect = includesTruthy([
    useSelector(getSyncing),
    useSelector(getCreatingPlaylist),
    useSelector(getMessage),
  ])

  useEffect(() => {
    dispatch(authorize(location.search))
  }, [])

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/', { replace: true })
    }
  }, [shouldRedirect])

  return null
}

export default Auth
