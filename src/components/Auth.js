import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authorize } from 'state/actions'

/**
 * Authorization component that handles all OAuth redirects
 *
 * @param {RouteComponentProps} props
 */
function Auth({ location }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authorize(location.search))
  }, [])

  return null
}

export default Auth
