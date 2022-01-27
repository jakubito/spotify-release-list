import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authorize } from 'state/actions'
import { getCreatingPlaylist, getMessage, getSyncing } from 'state/selectors'

/**
 * Authorization component that handles all OAuth redirects
 */
function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const syncing = useSelector(getSyncing)
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const message = useSelector(getMessage)
  const firstRender = useRef(true)

  useEffect(() => {
    if (!firstRender.current) navigate('/')
  }, [syncing, creatingPlaylist, message])

  useEffect(() => {
    dispatch(authorize({ locationSearch: location.search }))
    firstRender.current = false
  }, [])

  return null
}

export default Auth
