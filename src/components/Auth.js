import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from '@reach/router'
import * as Sentry from '@sentry/browser'
import { getNonce } from 'state/selectors'
import { setToken, showErrorMessage } from 'state/actions'
import { AuthError, validateAuthRequest } from 'auth'

/**
 * Authorization component that handles all OAuth redirects
 *
 * @param {RouteComponentProps} props
 */
function Auth(props) {
  const dispatch = useDispatch()
  const nonce = useSelector(getNonce)

  try {
    const { action, token, tokenExpires, scope } = validateAuthRequest(nonce)

    dispatch(setToken(token, tokenExpires, scope))
    dispatch({ type: action })
  } catch (error) {
    dispatch(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    Sentry.captureException(error)
  }

  return <Redirect to="/" noThrow />
}

export default Auth
