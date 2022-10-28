const {crearVentanaPrincipal} = require('./main');
const {app} = require('electron');


app.allowRendererProcessReuse = true;
app.whenReady()
.then(crearVentanaPrincipal)


app.on('window-all-closed', () => {
    app.quit();
});
