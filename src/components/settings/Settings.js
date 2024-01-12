import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { deferred, modalsClosed } from 'helpers'
import { setLastSettingsPath } from 'state/actions'
import { VerticalLayout, HorizontalLayout, Content } from 'components/common'
import SettingsHeader from './SettingsHeader'
import SettingsMenu from './SettingsMenu'

/**
 * Settings screen
 */
function Settings() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLastSettingsPath(location.pathname))
  }, [location])

  useHotkeys('esc, enter', deferred(navigate, '/'), {
    enabled: modalsClosed,
    enableOnFormTags: ['input', 'select'],
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
