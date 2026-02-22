export const APP_INFO = {
  name: 'Digilist',
  version: '1.0.0',
  description: 'A simple and intuitive task management app',
  author: 'William Solanderstr',
  email: 'support@digilist.app', // Update with your email
  website: 'https://digilist.app', // Update with your website
  privacyPolicyUrl: 'https://digilist.app/privacy', // Update with actual URL
  termsOfServiceUrl: 'https://digilist.app/terms', // Update with actual URL
};

export const DATA_STORAGE = {
  storageKey: '@digilist_tasks',
  storageLocation: 'Device only - no cloud sync',
  dataRetention: 'Data persists until app is uninstalled or manually cleared',
};

export const ACCESSIBILITY = {
  minimumTouchTargetSize: 44, // px - WCAG 2.1 Level AAA
};
