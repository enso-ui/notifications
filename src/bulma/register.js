import Notification from './components/navbar/Notifications.vue';
import ToastPosition from './components/settings/ToastrPosition.vue';

export default App => {
    App.registerNavbarItem('notification', Notification, 300, 'core.notifications.count');
    App.registerSettingsItem('toaster-position', ToastPosition, 300);
};
