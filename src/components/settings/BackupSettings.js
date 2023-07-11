import Ajv from 'ajv/dist/jtd'
import schema from 'schemas/settings.jtd.json'
import CurrentSettingsField from './CurrentSettingsField'
import LoadSettingsField from './LoadSettingsField'

// extend schema to allow importing legacy backups
const parserSchema = {
  ...schema,
  optionalProperties: {
    market: { type: 'string' },
  },
}

const ajv = new Ajv()
/** @type {SettingsSerializer} */
const serialize = ajv.compileSerializer(schema)
/** @type {SettingsParser} */
const parse = ajv.compileParser(parserSchema)

/**
 * Render settings backup screen
 */
function BackupSettings() {
  return (
    <div className="fade-in">
      <CurrentSettingsField serialize={serialize} />
      <LoadSettingsField parse={parse} />
    </div>
  )
}

export default BackupSettings
