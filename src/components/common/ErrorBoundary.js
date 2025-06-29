import React from 'react'
import { captureException } from 'helpers'
import { AppError, getErrorCategory, getErrorSeverity } from 'errors'
import { getUserFriendlyMessage, getRecoverySuggestions } from 'errors/errorMessages'
import { Button } from 'components/common'

/**
 * Error boundary component to catch React errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    })

    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Report to Sentry with additional context
    const appError = error instanceof AppError ? error : new AppError(
      error.message || 'React Error Boundary triggered',
      'REACT_ERROR',
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    )
    
    captureException(appError)
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const category = getErrorCategory(error)
      const severity = getErrorSeverity(error)
      const userMessage = getUserFriendlyMessage(error, category)
      const suggestions = getRecoverySuggestions(error, category)

      return (
        <div className="ErrorBoundary">
          <div className="ErrorBoundary__content">
            <div className="ErrorBoundary__icon">
              <i className="fas fa-exclamation-triangle" />
            </div>
            
            <h2 className="ErrorBoundary__title">
              {userMessage.title}
            </h2>
            
            <p className="ErrorBoundary__message">
              {userMessage.message}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="ErrorBoundary__details">
                <summary>Technical Details (Development)</summary>
                <pre className="ErrorBoundary__error">
                  {error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="ErrorBoundary__suggestions">
              <h3>What you can try:</h3>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="ErrorBoundary__actions">
              <Button
                title="Try Again"
                onClick={this.handleRetry}
                primary
                icon="fas fa-redo"
              />
              <Button
                title="Reload Page"
                onClick={this.handleReload}
                icon="fas fa-sync"
              />
            </div>

            {severity === 'critical' && (
              <div className="ErrorBoundary__critical">
                <p>
                  This appears to be a critical error. If the problem persists, 
                  please contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary