/**
 * Enhanced error handling system
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(message, code, context = {}) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.context = context
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(message, statusCode, endpoint, context = {}) {
    super(message, 'NETWORK_ERROR', { statusCode, endpoint, ...context })
    this.name = 'NetworkError'
    this.statusCode = statusCode
    this.endpoint = endpoint
  }
}

/**
 * Authentication-related errors
 */
export class AuthenticationError extends AppError {
  constructor(message, context = {}) {
    super(message, 'AUTH_ERROR', context)
    this.name = 'AuthenticationError'
  }
}

/**
 * Spotify API specific errors
 */
export class SpotifyAPIError extends AppError {
  constructor(message, statusCode, endpoint, spotifyError = null, context = {}) {
    super(message, 'SPOTIFY_API_ERROR', { 
      statusCode, 
      endpoint, 
      spotifyError,
      ...context 
    })
    this.name = 'SpotifyAPIError'
    this.statusCode = statusCode
    this.endpoint = endpoint
    this.spotifyError = spotifyError
  }
}

/**
 * Data validation errors
 */
export class ValidationError extends AppError {
  constructor(message, field, value, context = {}) {
    super(message, 'VALIDATION_ERROR', { field, value, ...context })
    this.name = 'ValidationError'
    this.field = field
    this.value = value
  }
}

/**
 * Storage-related errors
 */
export class StorageError extends AppError {
  constructor(message, operation, context = {}) {
    super(message, 'STORAGE_ERROR', { operation, ...context })
    this.name = 'StorageError'
    this.operation = operation
  }
}

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Error categories for user-friendly messaging
 */
export const ErrorCategory = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  SPOTIFY_API: 'spotify_api',
  VALIDATION: 'validation',
  STORAGE: 'storage',
  UNKNOWN: 'unknown'
}

/**
 * Get error category from error instance
 */
export function getErrorCategory(error) {
  if (error instanceof NetworkError) return ErrorCategory.NETWORK
  if (error instanceof AuthenticationError) return ErrorCategory.AUTHENTICATION
  if (error instanceof SpotifyAPIError) return ErrorCategory.SPOTIFY_API
  if (error instanceof ValidationError) return ErrorCategory.VALIDATION
  if (error instanceof StorageError) return ErrorCategory.STORAGE
  return ErrorCategory.UNKNOWN
}

/**
 * Get error severity based on error type and context
 */
export function getErrorSeverity(error) {
  if (error instanceof AuthenticationError) return ErrorSeverity.HIGH
  if (error instanceof SpotifyAPIError && error.statusCode >= 500) return ErrorSeverity.HIGH
  if (error instanceof NetworkError && error.statusCode >= 500) return ErrorSeverity.MEDIUM
  if (error instanceof StorageError) return ErrorSeverity.MEDIUM
  if (error instanceof ValidationError) return ErrorSeverity.LOW
  return ErrorSeverity.MEDIUM
}