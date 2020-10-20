import React from 'react'
import PropTypes from 'prop-types'

function NoData({ title }) {
  return (
    <div className="center has-text-light has-text-weight-semibold">
      <div className="is-size-5 has-text-centered">{title}</div>
    </div>
  )
}

NoData.propTypes = {
  title: PropTypes.string.isRequired,
}

export default NoData
