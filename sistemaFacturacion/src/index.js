const {crearVentanaPrincipal} = require('./main');
const {app} = require('electron');
if (require('electron-squirrel-startup')) app.quit();

app.allowRendererProcessReuse = true;
app.whenReady()
.then(crearVentanaPrincipal)


app.on('window-all-closed', () => {
    app.quit();
});
