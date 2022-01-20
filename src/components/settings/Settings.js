import { useHotkeys } from 'react-hotkeys-hook'
import { Outlet, useNavigate } from 'react-router-dom'
import { deferred, modalsClosed } from 'helpers'
import { VerticalLayout, HorizontalLayout, Content } from 'components/common'
import SettingsHeader from './SettingsHeader'
import SettingsMenu from './SettingsMenu'

/**
 * Settings screen
 */
function Settings() {
  const navigate = useNavigate()

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
          <div className="Settings__children">
            <Outlet />
          </div>
        </HorizontalLayout>
      </Content>
    </VerticalLayout>
  )
}

export default Settings
