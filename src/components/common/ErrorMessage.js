import React from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { hideMessage } from 'state/actions'
import { getErrorCategory, getErrorSeverity } from 'errors'
import { getUserFriendlyMessage, getRecoverySuggestions } from 'errors/errorMessages'
import { Button } from 'components/common'

/**
 * Enhanced error message component
 */
function ErrorMessage({ error, onRetry, onDismiss, className }) {
  const dispatch = useDispatch()
  const category = getErrorCategory(error)
  const severity = getErrorSeverity(error)
  const userMessage = getUserFriendlyMessage(error, category)
  const suggestions = getRecoverySuggestions(error, category)

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    } else {
      dispatch(hideMessage())
    }
  }

  const getSeverityClass = () => {
    switch (severity) {
      case 'critical': return 'is-danger'
      case 'high': return 'is-warning'
      case 'medium': return 'is-info'
      case 'low': return 'is-light'
      default: return 'is-info'
    }
  }

  return (
    <div className={classNames('ErrorMessage notification', getSeverityClass(), className)}>
      <button 
        title="Close" 
        className="delete" 
        onClick={handleDismiss}
        aria-label="Close error message"
      />
      
      <div className="ErrorMessage__content">
        <div className="ErrorMessage__header">
          <span className="ErrorMessage__icon">
            <i className={classNames('fas', {
              'fa-exclamation-triangle': severity === 'critical' || severity === 'high',
              'fa-info-circle': severity === 'medium' || severity === 'low'
            })} />
          </span>
          <strong className="ErrorMessage__title">
            {userMessage.title}
          </strong>
        </div>
        
        <p className="ErrorMessage__message">
          {userMessage.message}
        </p>

        {suggestions.length > 0 && (
          <div className="ErrorMessage__suggestions">
            <details>
              <summary>What you can try</summary>
              <ul>
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </details>
          </div>
        )}

        <div className="ErrorMessage__actions">
          {onRetry && (
            <Button
              title={userMessage.action}
              onClick={onRetry}
              small
              primary
              icon="fas fa-redo"
            />
          )}
          
          {process.env.NODE_ENV === 'development' && (
            <Button
              title="View Details"
              onClick={() => console.error('Error Details:', error)}
              small
              text
              icon="fas fa-bug"
            />
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="ErrorMessage__debug">
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage