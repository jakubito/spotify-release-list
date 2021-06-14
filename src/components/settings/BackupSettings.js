import Ajv from 'ajv/dist/jtd'
import schema from 'schemas/settings.jtd.json'
import CurrentSettingsField from './CurrentSettingsField'
import LoadSettingsField from './LoadSettingsField'

const ajv = new Ajv()
/** @type {SettingsSerializer} */
const serialize = ajv.compileSerializer(schema)
/** @type {SettingsParser} */
const parse = ajv.compileParser(schema)

/**
 * Render settings backup screen
 *
 * @param {RouteComponentProps} props
 */
function BackupSettings(props) {
  return (
    <div className="fade-in">
      <CurrentSettingsField serialize={serialize} />
      <LoadSettingsField parse={parse} />
    </div>
  )
}

export default BackupSettings
