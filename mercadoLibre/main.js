const { app, BrowserWindow } = require("electron");
const url = require('url');
const path = require('path');

const isDev = !app.isPackaged;

if(isDev){
    require('electron-reload')(path.join(__dirname), {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        ignored: /node_modules|[\/\\]\./
    });
};

//Funcion para crear la ventana principal del proyecto
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: 'Mercado Libre',
        width: 1000,
        height: 600,

        webPreferences:{
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.maximize();

    //Cargamos la url del domuneot html que se va acargar
    if (isDev) {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL("http://localhost:3000");
    }else{
        mainWindow.loadURL(`file://${__dirname}/app/build/index.html`);
    }

};

//Cuando al aplicacion este lista que luego creee la ventana
app.whenReady().then(createMainWindow);