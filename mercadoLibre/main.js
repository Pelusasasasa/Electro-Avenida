const { app, BrowserWindow } = require("electron");
const url = require('url');
const path = require('path');

//Funcion para crear la ventana principal del proyecto
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: 'Mercado Libre',
        width: 1000,
        height: 600
    });


    mainWindow.webContents.openDevTools();

    const startURL = url.format({
        pathname: path.join(__dirname, './app/build/index.html'),
        protocol: 'file'
    });

    //Cargamos la url del domuneot html que se va acargar
    mainWindow.loadURL("http://localhost:3000");

};

//Cuando al aplicacion este lista que luego creee la ventana
app.whenReady().then(createMainWindow);