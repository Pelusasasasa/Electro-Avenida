const { Menu, MenuItem } = require("electron");

//Configuramos el menu secundario que va a aparecer alado del cursor
const menuSecundario = new Menu();

const seleccionarParaEliminar = new MenuItem({
    label: "Seleccionar para Eliminar",
    async click() {
        ventanaPrincipal.webContents.send('seleccionarParaEliminar');    
    }
});

const seleccionarParaReImprimir = new MenuItem({
    label:"Re Imprimir",
    async click(){
        ventanaPrincipal.webContents.send('reImprimir');
    }
});

const cambiarObservaciones = new MenuItem({
    label:"Cambiar Observacion",
    async click(){
        ventanaPrincipal.webContents.send('cambiarObservacion')
    }
});

const cancelarCuenta = new MenuItem({
    label:"Cancelar Cuenta",
    async click(){
        ventanaPrincipal.webContents.send('CancelarCuenta');
    }
});

const compensarCuenta = new MenuItem({
    label:"Compensar Cuenta",
    async click(){
        ventanaPrincipal.webContents.send('CompensarCuenta');
    }
});

const exportarXLSX = new MenuItem({
    label:"Exportar XLSX",
    async click(){
        ventanaPrincipal.webContents.send('exportarXLSX');
    }
});

const actualizarCuenta = new MenuItem({
    label: "Actualizar Cuenta",
    async click(){
        ventanaPrincipal.webContents.send('actualizarCuenta');
    }
});

const editarPresupuesto = new MenuItem({
    label: "Editar Presupuesto",
    async click(){
        nuevaVentana.webContents.send('editarPresupuesto');
    }
});

//Fin de Menu Secundario


function mostrarMenu(ventana,x,y){
    if (ventana === "VerPedidos") {
        if (!menuSecundario.items.find(menu => menu.label === "Seleccionar para Eliminar")) {
            menuSecundario.append(seleccionarParaEliminar);   
        }
    };

    if (ventana === "VerPrestamos") {
        if (!menuSecundario.items.find(menu => menu.label === "Re Imprimir")) {
            menuSecundario.append(seleccionarParaReImprimir);
        }
        if (!menuSecundario.items.find(menu => menu.label === "Cambiar Observacion")) {
            menuSecundario.append(cambiarObservaciones);
        }
    };

    if (ventana === "Cuenta Corriente") {
        if (!menuSecundario.items.find(menu => menu.label === "Compensar Cuenta")) {
            menuSecundario.append(compensarCuenta);
        };

        if (!menuSecundario.items.find(menu => menu.label === "Cancelar Cuenta")) {
            menuSecundario.append(cancelarCuenta);
        };

        if (!menuSecundario.items.find(menu => menu.label === "Exportar XLSX")) {
            menuSecundario.append(exportarXLSX);
        };
    };

    if(ventana === "Emitir Recibo"){
        if (!menuSecundario.items.find(menu => menu.label === "Actualizar Cuenta")) {
            menuSecundario.append(actualizarCuenta);
        } 
    };

    if (ventana === "Listado Presupuesto") {
        if (!menuSecundario.items.find(menu => menu.label === "Editar Presupuesto")) {
            menuSecundario.append(editarPresupuesto);
        } 
    };
    
    menuSecundario.popup({window:ventanaPrincipal,x,y:y+5})
}

module.exports = {mostrarMenu}