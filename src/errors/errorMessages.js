/**
 * User-friendly error messages
 */

import { ErrorCategory } from './index'

/**
 * Default error messages by category
 */
export const defaultErrorMessages = {
  [ErrorCategory.NETWORK]: {
    title: 'Connection Problem',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    action: 'Retry'
  },
  [ErrorCategory.AUTHENTICATION]: {
    title: 'Authentication Required',
    message: 'Your session has expired. Please log in again to continue.',
    action: 'Log In'
  },
  [ErrorCategory.SPOTIFY_API]: {
    title: 'Spotify Service Issue',
    message: 'There was a problem connecting to Spotify. Please try again in a moment.',
    action: 'Retry'
  },
  [ErrorCategory.VALIDATION]: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'Fix'
  },
  [ErrorCategory.STORAGE]: {
    title: 'Storage Problem',
    message: 'Unable to save your data. Please try again.',
    action: 'Retry'
  },
  [ErrorCategory.UNKNOWN]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    action: 'Retry'
  }
}

/**
 * Specific error messages for common scenarios
 */
export const specificErrorMessages = {
  // Network errors
  'NETWORK_TIMEOUT': {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    action: 'Retry'
  },
  'NETWORK_OFFLINE': {
    title: 'No Internet Connection',
    message: 'You appear to be offline. Please check your internet connection.',
    action: 'Check Connection'
  },
  
  // Authentication errors
  'AUTH_TOKEN_EXPIRED': {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    action: 'Log In'
  },
  'AUTH_INVALID_CREDENTIALS': {
    title: 'Invalid Credentials',
    message: 'Unable to authenticate with Spotify. Please try logging in again.',
    action: 'Log In'
  },
  
  // Spotify API errors
  'SPOTIFY_RATE_LIMITED': {
    title: 'Too Many Requests',
    message: 'Spotify is temporarily limiting requests. Please wait a moment and try again.',
    action: 'Wait and Retry'
  },
  'SPOTIFY_SERVICE_UNAVAILABLE': {
    title: 'Spotify Unavailable',
    message: 'Spotify services are temporarily unavailable. Please try again later.',
    action: 'Try Later'
  },
  
  // Storage errors
  'STORAGE_QUOTA_EXCEEDED': {
    title: 'Storage Full',
    message: 'Your browser storage is full. Please clear some data or use a different browser.',
    action: 'Clear Data'
  },
  'STORAGE_ACCESS_DENIED': {
    title: 'Storage Access Denied',
    message: 'Unable to access browser storage. Please check your browser settings.',
    action: 'Check Settings'
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error, category) {
  // Try to find specific message first
  if (error.code && specificErrorMessages[error.code]) {
    return specificErrorMessages[error.code]
  }
  
  // Fall back to category default
  if (defaultErrorMessages[category]) {
    return defaultErrorMessages[category]
  }
  
  // Ultimate fallback
  return defaultErrorMessages[ErrorCategory.UNKNOWN]
}

/**
 * Get recovery suggestions based on error
 */
export function getRecoverySuggestions(error, category) {
  const suggestions = []
  
  switch (category) {
    case ErrorCategory.NETWORK:
      suggestions.push('Check your internet connection')
      suggestions.push('Try refreshing the page')
      suggestions.push('Disable any VPN or proxy')
      break
      
    case ErrorCategory.AUTHENTICATION:
      suggestions.push('Log out and log back in')
      suggestions.push('Clear browser cookies and cache')
      suggestions.push('Check if Spotify is working in another tab')
      break
      
    case ErrorCategory.SPOTIFY_API:
      suggestions.push('Wait a few minutes and try again')
      suggestions.push('Check Spotify status page')
      suggestions.push('Try using a different browser')
      break
      
    case ErrorCategory.STORAGE:
      suggestions.push('Clear browser data')
      suggestions.push('Free up disk space')
      suggestions.push('Try using incognito/private mode')
      break
      
    default:
      suggestions.push('Refresh the page')
      suggestions.push('Try again in a few minutes')
      suggestions.push('Contact support if the problem persists')
  }
  
  return suggestions
}