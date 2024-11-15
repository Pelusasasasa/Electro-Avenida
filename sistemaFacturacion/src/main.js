const fs = require('fs');
require('update-electron-app')();
require('dotenv').config();
const axios = require("axios")
const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain, Menu,dialog, MenuItem } = require('electron');
const {autoUpdater} = require('electron-updater');

const {abrirVentana, configAxios} = require('./funciones');
const templateMenu = require('./menu');
const [pedidos, ventas, comprobantes] = require('./descargas/descargas');
const { mostrarMenu } = require('./menuSecundario/menuSecundario');


let URL
require('dotenv').config();

if (process.env.NODE_ENV === 'desarrollo') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
};

global.nuevaVentana = null;
global.ventanaPrincipal = null
global.nuevaVentanaDos = null
global.ventanaImprimir = null;

ipcMain.on('mostrar-menu',(e,{ventana,x,y})=>{
    e.preventDefault();
    mostrarMenu(ventana,x,y)
});

function crearVentanaPrincipal() {
    ventanaPrincipal = new BrowserWindow({  
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
        show:false
        
    });
    ventanaPrincipal.once('ready-to-show',e=>{
        ventanaPrincipal.show();
    })
    ventanaPrincipal.loadFile('src/index.html')
    ventanaPrincipal.maximize();
    ventanaPrincipal.once('listo para mostrar',()=>{
        autoUpdater.checkForUpdatesAndNotify();
    });
};

ipcMain.handle('elegirPath',async e=>{
     const path = (await dialog.showSaveDialog()).filePath;
     return path;
});

ipcMain.on('abrir-ventana-argumentos',(e,args)=>{
    const {path,vendedor,width,height,reinicio,informacion} = args
    abrirVentana(path,width,height,reinicio,informacion,vendedor)
})

//abrir ventana agregar cliente
ipcMain.on('abrir-ventana-agregar-cliente',(e,args)=>{
    abrirVentana('clientes/agregarCliente.html',1100,500);
    nuevaVentana.on('ready-to-show',()=>{
        nuevaVentana.webContents.send('vendedor',args)
    })
});

ipcMain.on('minimizar',e=>{
    ventanaPrincipal.minimize();
})


ipcMain.on('abrir-menu',()=>{
    ventanaPrincipal.setClosable(true);
    ventanaPrincipal.setMenuBarVisibility(true);
});

ipcMain.on('cerrar-menu',()=>{
    ventanaPrincipal.setClosable(false);
    ventanaPrincipal.setMenuBarVisibility(false);
})

//INICIO PRODUCTOS

//mandamos el producto a emitir comprobante
ipcMain.on('mando-el-producto', async (e, args) => {
    ventanaPrincipal.webContents.send('mando-el-producto', JSON.stringify({
        id: args._id,
        cantidad: args.cantidad
    }));

})
//FIN PRODUCTOS


//INICIO CLIENTES

//Abrir ventana para modificar un cliente
ipcMain.on('abrir-ventana-modificar-cliente', (e, args) => {
    abrirVentana("clientes/modificarCliente.html",1100,600)
    const [idCliente,acceso,vendedor] = args
    nuevaVentana.on('ready-to-show',async ()=>{
        nuevaVentana.webContents.send('datos-clientes', JSON.stringify([idCliente,acceso]));
        nuevaVentana.webContents.send('vendedor',vendedor);
    })
    nuevaVentana.setMenuBarVisibility(false)
})

//mandamos el cliente a emitir comprobante
ipcMain.on('mando-el-cliente', async (e, args) => {
    ventanaPrincipal.webContents.send('mando-el-cliente', args)
    ventanaPrincipal.focus()
})

ipcMain.on('abrir-ventana-clientesConSaldo',async(e,args)=>{
    abrirVentana("resumenCuenta/clientes.html",1200,1200 , "noReinician");
    nuevaVentana.on('ready-to-show',()=>{
        nuevaVentana.webContents.send('situacion',JSON.stringify(args))
    })
})
//FIN CLIENTES



//INICIO VENTAS

//imprivimos una venta ya sea presupuesto o ticket factura
ipcMain.on('imprimir-venta',async(e,args)=>{
    const [venta,cliente,condicion,cantidad,tipo,calculo,lista,show] = args;
    let options
    if (tipo === "Ticket Factura" || tipo === "Factura B" || tipo === "Factura A") {
        options = {
            silent: condicion,
            copies: cantidad,
            deviceName: "SAM4S GIANT-100"
        };
    }else{
        options = {
            silent: condicion,
            copies: cantidad,
        };
    }
    
    if(tipo === "Ticket Factura" || tipo === "Factura A" || tipo === "Factura B"){
        abrirVentanaImprimir("impresion/ticket.html",1000,900,"noReinician",true)
    }else{
        abrirVentanaImprimir("impresion/presupuesto.html",1000,500,"noReinician",show);
    };
    const pasar = [venta,cliente,calculo,lista,options];
    await imprimir(pasar);
});

ipcMain.on('imprimir-recibo',async(e,args)=>{
    const [recibo,cliente,lista,tipo] = args;
    let options = {};
    if (tipo === "Recibos") {
        options = {
            silent: true,
            copies: 1,
            deviceName: "SAM4S GIANT-100"
        };
        abrirVentanaImprimir("impresion/ticketRecibo.html",500,1200,"noReinician",true);
    }else if(tipo === "Recibos_P"){
        abrirVentanaImprimir("emitirRecibo/imprimirRecibo.html",1000,900,"noReinician");
    };

    await imprimir([recibo,cliente,lista,tipo,options]);    
    
});

//funcion para imprimir presupuesto
const imprimir = (info)=>{;
    ventanaImprimir.webContents.on('did-finish-load',async function() {
        ventanaImprimir.webContents.send('info-para-imprimir',JSON.stringify(info));
    });
}   

ipcMain.on('imprimir',(e,args)=>{
    const opciones = JSON.parse(args);
    ventanaImprimir.webContents.print(opciones,(success, errorType) => {
        if (success) {
            ventanaPrincipal.focus()
            ventanaImprimir.close();
            ventanaImprimir=null;
            fs.writeFile(path.join(__dirname, '../prueba.txt'),JSON.stringify(opciones),(error)=>{
                if(error) throw error;
            });
        }else{
            ventanaPrincipal.focus();
            ventanaImprimir && ventanaImprimir.close();
            ventanaImprimir=null;
            fs.writeFile(path.join(__dirname, '../prueba.txt'),JSON.stringify(errorType),(error)=>{
                if(error) throw error;
            });
        }
    })
})

ipcMain.on('abrir-ventana-emitir-comprobante',(e,args)=>{
    const[vendedor,numeroVenta,empresa] = args
    abrirVentana("emitirComprobante/emitirComprobante.html",1000,1000)
    nuevaVentanaDos.on('ready-to-show',async ()=>{
        nuevaVentanaDos.webContents.send('venta',JSON.stringify([vendedor,numeroVenta,empresa]))
    })
});

ipcMain.on('facturar_varios',(e,args)=>{
    abrirVentana("emitirComprobante/emitirComprobante.html",1200,1000,true,args);
});

//FIN VENTAS

//Abrir ventana para modificar un producto
ipcMain.on('abrir-ventana-modificar-producto',  (e, args) => {
    const [id,acceso,texto,seleccion,vendedor] = args
    abrirVentana('productos/modificarProducto.html',1300,700,'noReinician')
    nuevaVentana.on('ready-to-show',async ()=>{
    nuevaVentana.webContents.send('id-producto', id)
    nuevaVentana.webContents.send('acceso', JSON.stringify(acceso));
    nuevaVentana.webContents.send('vendedor', vendedor);
    })
    nuevaVentana.on('close', async()=> {
        ventanaPrincipal.once('ready-to-show',async ()=>{
        })
        
        nuevaVentana = null
    })
});

ipcMain.on('producto-agregado',(e,args)=>{
    ventanaPrincipal.webContents.send('producto-agregado',JSON.stringify(args));

})

ipcMain.on('productoModificado',(e,args)=>{
    ventanaPrincipal.webContents.send('productoModificado',JSON.stringify(args));
});


//abrir ventana agregar producto
ipcMain.on('abrir-ventana-agregar-producto',async(e,args)=>{
    abrirVentana('productos/agregarProducto.html',1300,700,'noReinician',args)
})


//INICIO MOVIMIENTO DE PRODUCTOS

//Abrir ventana de movimiento de producto
ipcMain.on('abrir-ventana-movimiento-producto',async (e,arreglo)=>{
    const [id,vendedor] = arreglo
    abrirVentana('movProductos/movProductos.html',800,500,"noReinician")
    nuevaVentana.on('ready-to-show',()=>{
        nuevaVentana.webContents.send('movimiento-producto-abrir',(JSON.stringify([id,vendedor])) )
    })
})

//Abrir ventana de Informacion de producto
ipcMain.on('abrir-ventana-info-movimiento-producto',async (e,args)=>{
    abrirVentana('movProductos/infoMovProductos.html',1200,600,"noReinician")

//informacion de movimiento de producto
    nuevaVentana.on('ready-to-show',async()=>{
        nuevaVentana.webContents.send('datos-movimiento-producto',args)
    })
})

//FIN MOVIMIENTO DE PRODUCTOS


ipcMain.on('enviar-arreglo-descarga',(e,args)=>{
    const informacion = args[2];
    if (informacion === "porComprobante") {
        //Hasta aca llega
        descargas('PorComprobante',args[0],args[1]);
    }else{
        descargas('Ventas',args[0],args[1]);
    }
});

//AbrirVentanaParaBuscarUnCliente
ipcMain.on('abrir-ventana', (e, args) => {
      abrirVentana(args)
})

ipcMain.on('abrir-ventana-tarjeta', (e, args) => {
    abrirVentana(args.path,args.width,args.height,args.reinicio,args.informacion)
});

ipcMain.on('editarPresupuesto', (e,numero) => {
    nuevaVentana.close();

    ventanaPrincipal.loadURL(url.format({
        pathname: path.join(__dirname, './emitirComprobante/emitirComprobante.html'),
        protocol: 'file',
        slashes: true
    }));

    ventanaPrincipal.once('ready-to-show', () => {
        ventanaPrincipal.webContents.send('editarPresupuesto', numero);
    });
    
});

const abrirVentanaImprimir = async(texto,width,height,reinicio,show=false)=>{
    ventanaImprimir = new BrowserWindow({
        parent:ventanaPrincipal,
        modal:true,
        width: width,
        height: height,
        show:show,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })
    ventanaImprimir.loadURL(url.format({
        pathname: path.join(__dirname, `./${texto}`),
        protocol: 'file',
        slashes: true
    }));

    ventanaImprimir.on('ready-to-show',e=>{
        if ((ventanaPrincipal.webContents.getURL()).includes('consultar/cuentaCorriente.html')) {
            ventanaImprimir.show();
        }
    })

    ventanaImprimir.setMenuBarVisibility(false)
    ventanaImprimir.on('close',e=>{
        ventanaImprimir = null;
        reinicio !== "noReinician" && ventanaPrincipal.reload()
    });
}


//Aca hacemos que se descargue un excel Ya sea con los pedidos o con las ventas

async function descargas(nombreFuncion,ventasTraidas,path) {
    if(nombreFuncion === "Pedidos"){
        pedidos((await axios.get(`${URL}pedidos`,configAxios)).data,path)
    }else if(nombreFuncion === "Ventas"){
        ventas(ventasTraidas,path);
    }else if(nombreFuncion === "PorComprobante"){
        comprobantes(ventasTraidas,path);
    }
};

//Menu de navegacion
const mainMenu = Menu.buildFromTemplate(templateMenu)

Menu.setApplicationMenu(mainMenu)
module.exports = { crearVentanaPrincipal, abrirVentana }

autoUpdater.on('actualización-disponible', () => { 
    mainWindow.webContents.send('actualización_disponible'); 
});

autoUpdater.on('actualización-descargada', () => { 
   mainWindow.webContents.send('actualización_descargada'); 
});