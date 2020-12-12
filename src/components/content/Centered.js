/**
 * Render vertically and horizontally centered content
 *
 * @param {{ children: React.ReactNode }} props
 */
function Centered({ children }) {
  return (
    <div className="center has-text-light has-text-weight-semibold">
      <div className="is-size-5 has-text-centered">{children}</div>
    </div>
  )
}

export default Centered
