import {ipcMain} from 'electron';
import sentNotification from '@src/electron/services/notify';
import getProducts from '@src/electron/services/sql';
import mongoUploadAuditFile from '@src/electron/services/mongoapi';

console.log('\x1b[33m%s\x1b[0m', ' $$$ Importing Custom services [services/index.ts]...');

ipcMain.handle('notify', sentNotification);
ipcMain.handle('getProducts', getProducts);
ipcMain.handle('mongoUploadAuditFile', mongoUploadAuditFile);
