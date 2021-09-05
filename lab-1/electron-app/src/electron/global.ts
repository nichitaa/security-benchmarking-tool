import {mongoGetUploadFiles} from '@src/electron/services/mongoapi';

export {};

// TODO: definition for ipc / api
interface InotificationApi {
    sendNotification: (message: string) => void;
}

interface IdbApi {
    getProducts: () => any,
    mongoUploadAuditFile: (body: object) => any,
    mongoGetUploadFiles: () => any,
}

declare global {
    interface Window {
        'electron': {
            notificationApi: InotificationApi,
            dbApi: IdbApi
        };
    }
}
