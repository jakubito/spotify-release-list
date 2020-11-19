import queryString from 'query-string'
import moment from 'moment'
import { Base64 } from 'js-base64'
import { SYNC, CREATE_PLAYLIST } from 'state/actions'
import { Scope } from 'enums'

const { USER_FOLLOW_READ, PLAYLIST_MODIFY_PRIVATE, PLAYLIST_MODIFY_PUBLIC } = Scope

export class AuthError extends Error {
  /** @param {string} [message] */
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Validate incoming auth request and return parsed data
 *
 * @param {string} locationSearch
 * @param {string} locationHash
 * @param {string} nonce
 * @returns {{ action: string, scope: string, token: string, tokenExpires: string }}
 */
export function validateAuthRequest(locationSearch, locationHash, nonce) {
  /** @type {{ error?: string }} */
  const search = queryString.parse(locationSearch)

  if (search.error) {
    throw new AuthError('Access denied')
  }

  /** @type {{ access_token?: string, expires_in?: string, state?: string }} */
  const hash = queryString.parse(locationHash)

  if (!hash.access_token || !hash.expires_in || !hash.state) {
    throw new AuthError('Invalid request')
  }

  /** @type {{ nonce?: string, action?: string, scope?: string }} */
  const state = JSON.parse(Base64.decode(hash.state))

  if (state.nonce !== nonce) {
    throw new AuthError('Invalid request')
  }

  const { action, scope } = state
  const token = hash.access_token
  const tokenExpires = moment()
    .add(Number(hash.expires_in) - 60 * 5, 'seconds') // subtract 5 minutes just to be safe
    .toISOString()

  return { action, scope, token, tokenExpires }
}

/**
 * Check if token is valid and contains required scope for syncing
 *
 * @param {string} token
 * @param {string} tokenExpires
 * @param {string} tokenScope
 * @returns {boolean}
 */
export function isValidSyncToken(token, tokenExpires, tokenScope) {
  return isValidToken(token, tokenExpires) && Boolean(tokenScope?.includes(USER_FOLLOW_READ))
}

/**
 * Check if token is valid and contains required scope for creating playlist
 *
 * @param {string} token
 * @param {string} tokenExpires
 * @param {string} tokenScope
 * @param {boolean} isPrivate
 * @returns {boolean}
 */
export function isValidPlaylistToken(token, tokenExpires, tokenScope, isPrivate) {
  return (
    isValidToken(token, tokenExpires) &&
    Boolean(tokenScope?.includes(isPrivate ? PLAYLIST_MODIFY_PRIVATE : PLAYLIST_MODIFY_PUBLIC))
  )
}

/**
 * Check if token is valid
 *
 * @param {string} token
 * @param {string} tokenExpires
 * @returns {boolean}
 */
function isValidToken(token, tokenExpires) {
  return Boolean(token && tokenExpires && moment().isBefore(tokenExpires))
}

/**
 * Start sync authorization flow
 *
 * @param {string} nonce
 * @returns {void}
 */
export function startSyncAuthFlow(nonce) {
  startAuthFlow(SYNC, USER_FOLLOW_READ, nonce)
}

/**
 * Start playlist creation authorization flow
 *
 * @param {string} nonce
 * @param {boolean} isPrivate
 * @returns {void}
 */
export function startPlaylistAuthFlow(nonce, isPrivate) {
  startAuthFlow(
    CREATE_PLAYLIST,
    [USER_FOLLOW_READ, isPrivate ? PLAYLIST_MODIFY_PRIVATE : PLAYLIST_MODIFY_PUBLIC].join(' '),
    nonce
  )
}

/**
 * Start authorization flow
 *
 * @param {string} action
 * @param {string} scope
 * @param {string} nonce
 * @returns {void}
 */
function startAuthFlow(action, scope, nonce) {
  const state = Base64.encodeURI(JSON.stringify({ action, scope, nonce }))

  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_URL + '/auth/',
    response_type: 'token',
    show_dialog: String(false),
    scope,
    state,
  })

  const url = `https://accounts.spotify.com/authorize?${params}`

  window.location.replace(url)
}
