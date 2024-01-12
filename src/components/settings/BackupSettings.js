import Ajv from 'ajv/dist/jtd'
import schema from 'schemas/settings.jtd.json'
import CurrentSettingsField from './CurrentSettingsField'
import LoadSettingsField from './LoadSettingsField'

const parserSchema = {
  optionalProperties: {
    ...schema.properties,
    market: { type: 'string' }, // legacy field
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
