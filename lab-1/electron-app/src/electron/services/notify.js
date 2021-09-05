import { Notification } from 'electron';

// Electron Notification Service Here

const sentNotification = (_, message) => {
    new Notification({ title: "Notification", body: message }).show();
}

export default sentNotification;
