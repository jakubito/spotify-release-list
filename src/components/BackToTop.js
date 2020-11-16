import React, { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import Button from 'components/Button'

const SCROLL_THRESHOLD = 200

/**
 * Render back to top button
 */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const listener = throttle(() => {
      setVisible(document.documentElement.scrollTop > SCROLL_THRESHOLD)
    }, 200)

    window.addEventListener('scroll', listener)

    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <Button
      titleOnly="Back to top"
      icon="fas fa-arrow-up"
      onClick={() => window.scrollTo(0, 0)}
      className="BackToTop fade-in-bottom"
      medium
    />
  )
}

export default BackToTop
