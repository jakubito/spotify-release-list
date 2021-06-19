import { useHotkeys } from 'react-hotkeys-hook'
import { navigate } from '@reach/router'
import { deferred, modalsClosed } from 'helpers'
import { VerticalLayout, HorizontalLayout, Content } from 'components/common'
import SettingsHeader from './SettingsHeader'
import SettingsMenu from './SettingsMenu'

/**
 * Settings screen
 *
 * @param {RouteComponentProps & { children: React.ReactNode }} props
 */
function Settings({ children }) {
  useHotkeys('esc, enter', deferred(navigate, '/'), {
    filter: modalsClosed,
    enableOnTags: ['INPUT', 'SELECT'],
  })

  return (
    <VerticalLayout className="Settings">
      <SettingsHeader />
      <Content className="Settings__content">
        <HorizontalLayout className="Settings__layout">
          <SettingsMenu />
          <div className="Settings__children">{children}</div>
        </HorizontalLayout>
      </Content>
    </VerticalLayout>
  )
}

export default Settings
