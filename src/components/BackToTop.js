import { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import classNames from 'classnames'
import { Button } from 'components/common'

/**
 * Vertical scroll threshold in pixels
 */
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

  return (
    <Button
      titleOnly="Back to top"
      icon="fas fa-arrow-up"
      onClick={() => window.scrollTo(0, 0)}
      className={classNames('BackToTop', { 'is-sr-only': !visible })}
      medium
    />
  )
}

export default BackToTop
