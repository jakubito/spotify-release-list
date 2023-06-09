import { Base64 } from 'js-base64'
import queryString from 'query-string'
import moment from 'moment'
import { ArtistSource, Scope } from 'enums'

const CODE_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const TOKEN_API_URL = 'https://accounts.spotify.com/api/token'
const AUTH_REDIRECT_URL = process.env.REACT_APP_URL + '/auth'
const AUTH_DATA_KEY = 'authData'

const { FOLLOWED, SAVED_ALBUMS, SAVED_TRACKS } = ArtistSource
const { USER_FOLLOW_READ, USER_LIBRARY_READ, PLAYLIST_MODIFY_PRIVATE, PLAYLIST_MODIFY_PUBLIC } =
  Scope

/**
 * Represents an error encountered during authorization
 */
export class AuthError extends Error {
  /**
   * @param {string} [message]
   * @param {SentryContexts} [contexts]
   */
  constructor(message, contexts) {
    super(message)
    this.name = 'AuthError'
    this.contexts = contexts
  }
}

/**
 * Get the Spotify auth scopes for artist collection
 *
 * @param {ArtistSource[]} artistSources
 */
export function getSyncScopes(artistSources) {
  /** @type {Scope[]} */
  const scopes = []

  for (const source of artistSources) {
    if (source === FOLLOWED) scopes.push(USER_FOLLOW_READ)
    if (source === SAVED_ALBUMS || source === SAVED_TRACKS) scopes.push(USER_LIBRARY_READ)
  }

  return scopes
}

/**
 * Get the Spotify auth scope for playlist creation
 *
 * @param {boolean} isPrivate
 */
export function getPlaylistScope(isPrivate) {
  return isPrivate ? PLAYLIST_MODIFY_PRIVATE : PLAYLIST_MODIFY_PUBLIC
}

/**
 * Generate cryptographically strong random code verifier
 *
 * @param {number} [length]
 */
export function generateCodeVerifier(length = 50) {
  const randomValues = window.crypto.getRandomValues(new Uint32Array(length))
  const codeVerifier = Array.from(randomValues)
    .map((value) => value / 0x100000000) // Scale all values to [0, 1)
    .map((value) => CODE_CHARSET[Math.floor(value * CODE_CHARSET.length)])
    .join('')

  return codeVerifier
}

/**
 * Create base64 encoded code challenge
 *
 * @param {string} codeVerifier
 */
export async function createCodeChallenge(codeVerifier) {
  const codeBuffer = new TextEncoder().encode(codeVerifier)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', codeBuffer)
  const codeChallenge = Base64.fromUint8Array(new Uint8Array(hashBuffer), true)

  return codeChallenge
}

/**
 * Validate incoming auth request and return parsed data
 *
 * @param {string} locationSearch
 * @param {string} originalNonce
 */
export function validateAuthRequest(locationSearch, originalNonce) {
  /** @type {{ code?: string, state?: string, error?: string }} */
  const { code, state, error } = queryString.parse(locationSearch)

  if (error) {
    if (error === 'access_denied') {
      throw new AuthError('Access denied')
    }

    throw new AuthError('Authorization failed', { extra: { error } })
  }

  if (!code || !state) {
    throw new AuthError('Authorization failed', { extra: { locationSearch, code, state } })
  }

  /** @type {{ action?: Action, nonce?: string }} */
  const { action, nonce } = JSON.parse(Base64.decode(state))

  if (nonce !== originalNonce) {
    throw new AuthError('Authorization failed', { extra: { locationSearch, nonce, originalNonce } })
  }

  return { code, action }
}

/**
 * Start authorization flow
 *
 * @param {Action} action
 * @param {string} scope
 * @param {string} codeChallenge
 * @param {string} nonce
 */
export function startAuthFlow(action, scope, codeChallenge, nonce) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: AUTH_REDIRECT_URL,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: Base64.encodeURI(JSON.stringify({ action, nonce })),
    scope,
  })

  window.location.assign(`${AUTHORIZE_URL}?${params}`)
}

/**
 * Exchange authorization code for a token
 *
 * @param {string} code
 * @param {string} codeVerifier
 */
export function exchangeCode(code, codeVerifier) {
  return tokenRequest({
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: AUTH_REDIRECT_URL,
    code_verifier: codeVerifier,
    code,
  })
}

/**
 * Request new token
 *
 * @param {string} refreshToken
 */
export function getRefreshedToken(refreshToken) {
  return tokenRequest({
    grant_type: 'refresh_token',
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    refresh_token: refreshToken,
  })
}

/**
 * Spotify token endpoint request wrapper
 *
 * @param {Record<string, string>} body
 */
async function tokenRequest(body) {
  const response = await fetch(TOKEN_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  })

  if (response.ok) {
    /** @type {TokenApiResponse} */
    const json = await response.json()

    return /** @type {TokenApiResult} */ ({
      token: json.access_token,
      tokenScope: json.scope,
      tokenExpires: moment().add(Number(json.expires_in), 'seconds').toISOString(),
      refreshToken: json.refresh_token,
    })
  }

  throw new AuthError(response.statusText)
}

/**
 * Load auth data from local storage
 */
export function getAuthData() {
  const authData = localStorage.getItem(AUTH_DATA_KEY)
  return /** @type {AuthData} */ (authData ? JSON.parse(authData) : {})
}

/**
 * Save auth data to local storage
 *
 * @param {AuthData} authData
 */
export function setAuthData(authData) {
  localStorage.setItem(AUTH_DATA_KEY, JSON.stringify({ ...getAuthData(), ...authData }))
}

/**
 * Clear auth data
 */
export function deleteAuthData() {
  localStorage.removeItem(AUTH_DATA_KEY)
}
