import { rp } from './registryHelper';

export const myDetailsRegistry: Record<string, () => any> = {
  // System Updates
  'my-release-note-detail': rp(
    () => import('../my-details/settings/ReleaseNoteDetail'),
    'ReleaseNoteDetail'
  ),

  // Communication
  'my-messages-inbox': rp(
    () => import('../my-details/communication/MyMessagesInbox'),
    'MyMessagesInbox'
  ),
  'my-sent-drafts': rp(
    () => import('../my-details/communication/MySentDrafts'),
    'MySentDrafts'
  ),
  'my-notification-centre': rp(
    () => import('../my-details/communication/MyNotificationCentre'),
    'MyNotificationCentre'
  ),
  'notification-queue-resend-utility': rp(
    () => import('../admin/utilities/NotificationQueueResendUtility'),
    'NotificationQueueResendUtility'
  ),
  'my-announcement-subscriptions': rp(
    () => import('../my-details/communication/MyAnnouncementSubscriptions'),
    'MyAnnouncementSubscriptions'
  ),
  'my-meeting-requests': rp(
    () => import('../my-details/communication/MyMeetingRequests'),
    'MyMeetingRequests'
  ),
  'my-communication-history': rp(
    () => import('../my-details/communication/MyCommunicationHistory'),
    'MyCommunicationHistory'
  ),
  'my-feedback-suggestions': rp(
    () => import('../my-details/communication/MyFeedbackSuggestions'),
    'MyFeedbackSuggestions'
  ),

  // Policies (shown under My Details ▸ Manage Settings)
  'my-policy-library': rp(
    () => import('../my-details/settings/MyPolicyLibrary'),
    'MyPolicyLibrary'
  ),
  'my-policy-acknowledgements': rp(
    () => import('../my-details/settings/MyPolicyAcknowledgements'),
    'MyPolicyAcknowledgements'
  ),

  // Settings
  'my-account-settings': rp(
    () => import('../my-details/settings/MyAccountSettings'),
    'MyAccountSettings'
  ),
  'my-password-security': rp(
    () => import('../my-details/settings/MyPasswordSecurity'),
    'MyPasswordSecurity'
  ),
  'my-display-language': rp(
    () => import('../my-details/settings/MyDisplayLanguage'),
    'MyDisplayLanguage'
  ),
  'my-linked-accounts': rp(
    () => import('../my-details/settings/MyLinkedAccounts'),
    'MyLinkedAccounts'
  ),
  'my-device-sessions': rp(
    () => import('../my-details/settings/MyDeviceSessions'),
    'MyDeviceSessions'
  ),
  'my-data-access-log': rp(
    () => import('../my-details/settings/MyDataAccessLog'),
    'MyDataAccessLog'
  ),

  // Calendar (opened from the header calendar icon)
  'my-school-calendar': rp(
    () => import('../my-details/calendar/MyCalendar'),
    'MyCalendar'
  )
};