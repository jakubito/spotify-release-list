import { Route, Routes as RouterRoutes } from 'react-router-dom'
import { Auth, App } from 'components'
import { Releases } from 'components/releases'
import {
  Settings,
  GeneralSettings,
  AppearanceSettings,
  BlocklistSettings,
  AboutSettings,
  AutomationSettings,
  BackupSettings,
} from 'components/settings'

function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<App />}>
        <Route index element={<Releases />} />
        <Route path="settings" element={<Settings />}>
          <Route index element={<GeneralSettings />} />
          <Route path="appearance" element={<AppearanceSettings />} />
          <Route path="blocklists" element={<BlocklistSettings />} />
          <Route path="automation" element={<AutomationSettings />} />
          <Route path="backup" element={<BackupSettings />} />
          <Route path="about" element={<AboutSettings />} />
        </Route>
      </Route>
      <Route path="auth" element={<Auth />} />
    </RouterRoutes>
  )
}

export default Routes
