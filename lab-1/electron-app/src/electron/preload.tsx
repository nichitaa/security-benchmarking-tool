const {ipcRenderer, contextBridge} = require('electron');

console.log('😀 Loading Preload [preload.tsx]...');

const dbApi = {
    getProducts: async () => {
        return await ipcRenderer.invoke('getProducts');
    },
    mongoUploadAuditFile: async (body) => {
        return await ipcRenderer.invoke('mongoUploadAuditFile', body);
    }
};

const notificationApi = {
    sendNotification: async (message: string) => {
        return await ipcRenderer.invoke('notify', message)
    },
};

contextBridge.exposeInMainWorld('electron', {
    notificationApi,
    dbApi,
});
