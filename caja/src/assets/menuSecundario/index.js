const {Menu, MenuItem} = require('electron');

const menuSecundario = new Menu();

const eliminarCuentaCorriente = new MenuItem({
    label: 'Eliminar Cuenta Corriente',
    async click(){
        nuevaVentana.webContents.send('eliminarCuentaCorriente');
    }
});


const mostrarMenu = (ventana,x,y) => {
    if(ventana === "cuentaCorrienteProvedores"){
        if (!menuSecundario.items.find(menu => menu.label === 'Eliminar Cuenta Corriente')) {
            menuSecundario.append(eliminarCuentaCorriente);
        }
    };

    menuSecundario.popup({window: ventanaPrincipal, x: x, y: y});
};

module.exports = mostrarMenu;