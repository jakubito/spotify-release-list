import { Base64 } from 'js-base64'
import queryString from 'query-string'
import moment from 'moment'

const CODE_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const TOKEN_API_URL = 'https://accounts.spotify.com/api/token'
const AUTH_REDIRECT_URL = process.env.REACT_APP_URL + '/auth'

/**
 * Represents an error encountered during authorization
 */
export class AuthError extends Error {
  /** @param {string} [message] */
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Generate cryptographically strong random code verifier
 *
 * @param {number} [length]
 * @returns {string}
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
 * @returns {Promise<string>}
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
 * @returns {{ code: string, action: Action }}
 */
export function validateAuthRequest(locationSearch, originalNonce) {
  /** @type {{ code?: string, state?: string, error?: string }} */
  const { code, state, error } = queryString.parse(locationSearch)

  if (error) {
    throw new AuthError(`Authorization failed (${error})`)
  }

  if (!code || !state) {
    throw new AuthError('Invalid request')
  }

  /** @type {{ action?: Action, nonce?: string }} */
  const { action, nonce } = JSON.parse(Base64.decode(state))

  if (nonce !== originalNonce) {
    throw new AuthError('Invalid request')
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
 * @returns {void}
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

  window.location.replace(`${AUTHORIZE_URL}?${params}`)
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
 * @returns {Promise<TokenApiResult>}
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

    return {
      token: json.access_token,
      tokenScope: json.scope,
      tokenExpires: moment().add(Number(json.expires_in), 'seconds').toISOString(),
      refreshToken: json.refresh_token,
    }
  }

  throw new AuthError(response.statusText)
}
