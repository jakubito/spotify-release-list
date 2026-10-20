import LabelBlocklistField from './LabelBlocklistField'
import ArtistBlocklistField from './ArtistBlocklistField'
import AlbumBlocklistField from './AlbumBlocklistField'

/**
 * Render blocklist settings fields
 */
function BlocklistSettings() {
  return (
    <div className="fade-in">
      <LabelBlocklistField />
      <ArtistBlocklistField />
      <AlbumBlocklistField />
    </div>
  )
}

export default BlocklistSettings
