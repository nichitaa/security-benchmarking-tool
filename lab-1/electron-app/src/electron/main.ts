import {app, BrowserWindow} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


console.log('\x1b[33m%s\x1b[0m', '\n $$$ Loading Main [main.ts]...');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    console.log('\x1b[33m%s\x1b[0m', ' $$$ Creating electron Window [main.ts]...');

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#171b21',
        show: false,
        autoHideMenuBar: true,
        title: 'electron-damafon',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            // enableRemoteModule: true,
            // contextIsolation: false,
            // nodeIntegrationInWorker: false,
            // nodeIntegrationInSubFrames: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
        // import all services
        require('./services/index');
    });

    mainWindow.webContents.openDevTools();

    // install react devtools extension
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
        console.log('\x1b[33m%s\x1b[0m', ` $$$ Added Extension:  ${name}`);
    }).catch((err) => {
        console.log('\x1b[33m%s\x1b[0m', ' XXX An error occurred: ', err);
    });

    // Show window when its ready to
    mainWindow.on('ready-to-show', () => mainWindow.show());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
