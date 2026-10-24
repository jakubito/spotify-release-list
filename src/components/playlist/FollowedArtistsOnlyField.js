import { Checkbox } from 'components/common'
import HelpText from 'components/settings/HelpText'

/**
 * @param {Pick<React.ComponentProps<typeof Checkbox>, 'name' | 'checked' | 'onChange' | 'ref'>} props
 */
function FollowedArtistsOnlyField(props) {
  return (
    <div className="field">
      <Checkbox id="followedArtistsOnly" label="Skip tracks without followed artists" {...props} />
      <div className="mt-2">
        <HelpText>
          Leaves out tracks that don&apos;t credit any artist you follow, such as the rest of an
          album they only feature on.
        </HelpText>
      </div>
    </div>
  )
}

export default FollowedArtistsOnlyField
