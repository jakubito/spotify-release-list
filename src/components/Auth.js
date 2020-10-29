import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from '@reach/router'
import queryString from 'query-string'
import moment from 'moment'
import { Base64 } from 'js-base64'
import { getNonce } from 'selectors'
import { SYNC, CREATE_PLAYLIST, sync, setToken, showErrorMessage, createPlaylist } from 'actions'

/**
 * Authorization component that handles all OAuth redirects
 *
 * @param {RouteComponentProps} props
 */
function Auth(props) {
  const dispatch = useDispatch()
  const nonce = useSelector(getNonce)

  /** @type {{ error?: string }} */
  const search = queryString.parse(window.location.search)

  if (search.error) {
    return redirectWithError(dispatch, 'Error: Access denied')
  }

  /** @type {{ access_token?: string, expires_in?: string, state?: string }} */
  const hash = queryString.parse(window.location.hash)

  if (!hash.access_token || !hash.expires_in || !hash.state) {
    return redirectWithError(dispatch, 'Error: Invalid request')
  }

  /** @type {{ nonce?: string, action?: string, scope?: string }} */
  const state = JSON.parse(Base64.decode(hash.state))

  if (state.nonce !== nonce) {
    return redirectWithError(dispatch, 'Error: Invalid nonce')
  }

  const { action, scope } = state
  const token = hash.access_token
  const tokenExpires = moment()
    .add(Number(hash.expires_in) - 60 * 6, 'seconds')
    .toISOString()

  dispatch(setToken(token, tokenExpires, scope))

  if (action === SYNC) {
    dispatch(sync())
  } else if (action === CREATE_PLAYLIST) {
    dispatch(createPlaylist())
  }

  return redirectHome()
}

/**
 * Redirect to homepage with error message
 *
 * @param {function} dispatch - Redux dispatch function
 * @param {string} message - Error message
 */
function redirectWithError(dispatch, message) {
  dispatch(showErrorMessage(message))

  return redirectHome()
}

/**
 * Redirect to homepage
 */
function redirectHome() {
  return <Redirect to="/" noThrow />
}

export default Auth
