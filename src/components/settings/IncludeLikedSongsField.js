import { useSelector, useDispatch } from 'react-redux'
import { getIncludeLikedSongs } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import HelpText from './HelpText'

/**
 * Include liked songs field
 */
function IncludeLikedSongsField() {
  const includeLikedSongs = useSelector(getIncludeLikedSongs)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newIncludeLikedSongs = Boolean(Number(event.target.value))

    defer(dispatch, setSettings({ includeLikedSongs: newIncludeLikedSongs }))
  }

  return (
    <div className="LikedSongsField Settings__field field">
      <label className="label has-text-light">
        Liked songs{' '}
        <HelpText>If enabled, this will include artists whose songs you've liked.</HelpText>
      </label>
      <div className="control">
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="includeLikedSongsFalse"
            type="radio"
            name="includeLikedSongs"
            value="0"
            defaultChecked={!includeLikedSongs}
            onChange={onChange}
          />
          <label htmlFor="includeLikedSongsFalse">Exclude</label>
        </div>
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="includeLikedSongsTrue"
            type="radio"
            name="includeLikedSongs"
            value="1"
            defaultChecked={includeLikedSongs}
            onChange={onChange}
          />
          <label htmlFor="includeLikedSongsTrue">Include</label>
        </div>
      </div>
    </div>
  )
}

export default IncludeLikedSongsField
