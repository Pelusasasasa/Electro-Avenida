
require('dotenv').config();
const axios = require("axios")
const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain, Menu,dialog } = require('electron');

const {abrirVentana} = require('./funciones');
const templateMenu = require('./menu');
const [pedidos, ventas] = require('./descargas/descargas')

let URL

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
};
global.nuevaVentana = null;
global.ventanaPrincipal = null
global.nuevaVentanaDos = null
global.ventanaImprimir = null

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
    ventanaPrincipal.maximize()
}

ipcMain.on('elegirPath',async e=>{
     const path = (await dialog.showSaveDialog()).filePath;
     e.reply('mandoPath',path);
})

//abrir ventana agregar cliente
ipcMain.on('abrir-ventana-agregar-cliente',e=>{
    abrirVentana('clientes/agregarCliente.html',1100,500)
})

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
    abrirVentana("clientes/modificarCliente.html",1100,450)
    const [idCliente,acceso] = args
    nuevaVentana.on('ready-to-show',async ()=>{
        nuevaVentana.webContents.send('datos-clientes', JSON.stringify([idCliente,acceso]))
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
    if (tipo === "Ticket Factura") {
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
    if (tipo === "Recibos_P") {
        abrirVentanaImprimir("emitirRecibo/imprimirRecibo.html",1000,900,"noReinician",show);
    }else if(tipo === "Recibos"){
        abrirVentanaImprimir("emitirComprobante/imprimirTicket.html",800,200,"noReinician",show);
    }else if(tipo === "Ticket Factura"){
        abrirVentanaImprimir("impresion/ticket.html",1000,900,"noReinician",false)
    }else{
        abrirVentanaImprimir("impresion/presupuesto.html",1000,500,"noReinician",show);
    };
    const pasar = [venta,cliente,calculo,lista,options]
    await imprimir(pasar);
})

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
        }else{
            ventanaPrincipal.focus();
            ventanaImprimir && ventanaImprimir.close();
            ventanaImprimir=null;
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
    abrirVentana("emitirComprobante/emitirComprobante.html",1200,1000,true,args)
});

//FIN VENTAS

//Abrir ventana para modificar un producto
ipcMain.on('abrir-ventana-modificar-producto',  (e, args) => {
    const [id,acceso,texto,seleccion] = args
    abrirVentana('productos/modificarProducto.html',1100,500,'noReinician')
    nuevaVentana.on('ready-to-show',async ()=>{
    nuevaVentana.webContents.send('id-producto', id)
    nuevaVentana.webContents.send('acceso', JSON.stringify(acceso))
    })
    nuevaVentana.on('close', async()=> {
        ventanaPrincipal.once('ready-to-show',async ()=>{
        })
        
        nuevaVentana = null
    })
});

ipcMain.on('productoModificado',(e,args)=>{
    ventanaPrincipal.webContents.send('productoModificado',JSON.stringify(args))
});


//abrir ventana agregar producto
ipcMain.on('abrir-ventana-agregar-producto',async(e,args)=>{
    abrirVentana('productos/agregarProducto.html',1100,500)
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
    descargas('Ventas',args[0],args[1]);
});

//AbrirVentanaParaBuscarUnCliente
ipcMain.on('abrir-ventana', (e, args) => {
      abrirVentana(args)
})

ipcMain.on('abrir-ventana-tarjeta', (e, args) => {
    abrirVentana(args.path,args.width,args.height,args.reinicio,args.informacion)
})



const abrirVentanaImprimir = async(texto,width,height,reinicio,show=false)=>{
    ventanaImprimir = new BrowserWindow({
        parent:ventanaPrincipal,
        modal:true,
        width: width,
        height: height,
        show:false,
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
    ventanaImprimir.setMenuBarVisibility(false)
    ventanaImprimir.on('close',e=>{
        ventanaImprimir = null;
        reinicio !== "noReinician" && ventanaPrincipal.reload()
    });
}


//Aca hacemos que se descargue un excel Ya sea con los pedidos o con las ventas

async function descargas(nombreFuncion,ventasTraidas,path) {
    if(nombreFuncion === "Pedidos"){
        pedidos((await axios.get(`${URL}pedidos`)).data,path)
    }else if(nombreFuncion === "Ventas"){
        ventas(ventasTraidas,path);
    }
}

//Menu de navegacion
const mainMenu = Menu.buildFromTemplate(templateMenu)

Menu.setApplicationMenu(mainMenu)
module.exports = { crearVentanaPrincipal, abrirVentana }


