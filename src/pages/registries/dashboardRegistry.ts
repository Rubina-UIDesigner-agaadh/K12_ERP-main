import { rp } from './registryHelper';

export const dashboardRegistry: Record<string, () => any> = {
  'user-dashboard': rp(
    () => import('../dashboard/UserDashboard'),
    'UserDashboard'
  ),
  'eis-consolidate-dashboard': rp(
    () => import('../dashboard/EisConsolidatedDashboard'),
    'EisConsolidatedDashboard'
  ),
  'mis-consolidate-dashboard': rp(
    () => import('../dashboard/MisConsolidatedDashboard'),
    'MisConsolidatedDashboard'
  ),
  'sms-predefine-alert': rp(
    () => import('../dashboard/SmsPredefinedAlerts'),
    'SmsPredefinedAlerts'
  )
};