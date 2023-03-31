const { app, BrowserWindow, ipcMain, Menu,dialog } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}
let ventanaPrincipal
let nuevaVentana

// Lo usamos para cuando alla un cambio en la aplicacion se reinicie
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
};

const abrirVentana = (direccion,width,height,reinicio,informacion,cerrarVentana=false,informacionAgregar)=>{
  nuevaVentana = new BrowserWindow({
    width: width,
    height: height,
    parent:ventanaPrincipal,
    modal:true,
    show:false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false
    }
  });

  nuevaVentana.once('ready-to-show',()=>{
    nuevaVentana.show();

    if (cerrarVentana) {
      nuevaVentana.webContents.send('cerrar-ventana',cerrarVentana);
    }
    
    if (informacion) {
      nuevaVentana.webContents.send('recibir-informacion',informacion);
    }

    if(informacionAgregar){
      nuevaVentana.webContents.send('informacionAgregar',informacionAgregar)
    }

  });

  nuevaVentana.on('closed',()=>{
    nuevaVentana=null;
    if (reinicio) {
      ventanaPrincipal.reload();
    }
  })
  nuevaVentana.setMenuBarVisibility(false)
  nuevaVentana.loadFile(path.join(__dirname, `${direccion}`));
}

const createWindow = () => {
  ventanaPrincipal = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false
    }
  });
  ventanaPrincipal.maximize();

  ventanaPrincipal.loadFile(path.join(__dirname, 'index.html'));

  ventanaPrincipal.once('ready-to-show',()=>{
    ventanaPrincipal.show();
  });
};
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('abrir-ventana',(e,args)=>{
  const {path,width,height,reinicio,informacion,cerrarVentana,informacionAgregar} = args;
  abrirVentana(path,width,height,reinicio,informacion,cerrarVentana,informacionAgregar);
});

ipcMain.on('imprimirComprobantePago',(e,args)=>{
  abrirVentana('./provedores/comprobanteDePago.html',1000,1000,false,args)
});

ipcMain.on('imprimir',(e,args)=>{
  nuevaVentana.webContents.print({},(success,errorType)=>{
      ventanaPrincipal.focus()
      nuevaVentana.close();
      nuevaVentana=null;
  })
});

ipcMain.on('imprimir-libroIva',e=>{
  const opciones = {
    landscape:false  
  }
  ventanaPrincipal.webContents.print(opciones,(success,errorType)=>{
    console.log("a")
  })
})



ipcMain.on('enviar-info-ventana-principal',(e,args)=>{
  ventanaPrincipal.webContents.send('recibir-informacion',args);
});



const templateMenu = [

  {
    label:'Datos',
    submenu: [
      {
        label:'Cuentas',
        click(){
          abrirVentana("datos/cuentas.html",600,500)
        }
      },{
        label:"Provedores",
        submenu:[
          {
            label:"Provedores",
            click(){
              ventanaPrincipal.loadFile(path.join(__dirname, 'datos/provedores.html'))
              // abrirVentana("datos/provedores.html",600,500)
            }
          },
          {
            label:"listadoSaldo",
            click(){
              ventanaPrincipal.webContents.send('fecha')
            }
          }
        ]
      },{
        label:"Saldo Inicial",
        click(){
          ventanaPrincipal.webContents.send('saldoInicial')
        }
      },{
        label:"Tarjetas",
        click(){
          abrirVentana("datos/tarjetas.html",350,450);
        }
      }
    ]
  },
  {
    label:"Caja",
    submenu:[
      {
        label:"Cobranza Facturas",
        click(){
          ventanaPrincipal.send('cobranzaFacturas')
        }
      },
      {
        label:"Ingreso - Egreso",
        click(){
          abrirVentana('caja/movCaja.html',800,500)
        }
      },
      {
        label:"Modificar",
        click(){
          ventanaPrincipal.webContents.send('modificar');
        }
      },
      {
        label: "Caja General",
        click(){
          abrirVentana('caja/informeCaja.html',1200,1200)
        }
      },
      {
        label: "Ingresos",
        click(){
          abrirVentana('caja/ingreso.html',1200,1200,'','I')
        }
      },
      {
        label: "Egresos",
        click(){
          abrirVentana('caja/ingreso.html',1200,1200,'','E')
        }
      },
      {
        label: "Resumen de Valores",
        click(){
          ventanaPrincipal.webContents.send('fechas');
        }
      }
    ]
  },
  {
    label:"Vales",
    submenu:[
      {
        label:"Facturas A Cobrar",
        click(){
          ventanaPrincipal.webContents.send('facturas');
        }
      },
      {
        label:"A Cobrar/Pagar",
        click(){
          ventanaPrincipal.webContents.send('valesACobrar');
        }
      },
      {
        label:"Personal",
        click(){
          ventanaPrincipal.webContents.send('valesPersonal');
        }
      },
      {
        label:"Incobrables",
        click(){
          ventanaPrincipal.webContents.send('valesIncobrables');
        }
      },
      {
        label:"Tarjetas de Credito",
        click(){
          ventanaPrincipal.webContents.send('tarjetas');
        }
      },
      {
        label:"Cheques",
        click(){
          ventanaPrincipal.webContents.send('cheques');
        }
      },
    ]
  },
  {
    label: "Compras",
    submenu:[
      {
        label:"Ingreso Facturas",
        click(){
          ventanaPrincipal.webContents.send('ingresoFacturas');
        }
      },
      {
        label:"Modificar Compras",
        click(){
          ventanaPrincipal.webContents.send('modificarCompras');
        }
      },
      {
        label: "De Compras",
        click(){
          ventanaPrincipal.webContents.send('deCompras');
        }
      }
    ]
  },
  {
    label:"Provedores",
    submenu:[
      {
        label:"Emitir Pago",
        click(){
          ventanaPrincipal.webContents.send('emitirPago')
        }
      },
      {
        label:"Ingresar Varios",
        click(){
          abrirVentana('provedores/ingresarVarios.html',400,500)
        }
      },
      {
        label:"Cuenta Corriente",
        click(){
          abrirVentana('provedores/cuentaCorriente.html',1200,1000)
        }
      }
    ]
  },
  {
    label:"Bancos",
    submenu:[
      {
        label:"Cheques No Cobrados",
        click(){
          abrirVentana("bancos/chequesNoCobrados.html",1000,1000)
        }
      },{
        label:"Ingresar Pago Cheques Propios",
        click(){
          abrirVentana("bancos/ingresarPagoCheques.html",600,400)
        }
      }
    ]
  },
  {
    label:"s",
    accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
    click(item,focusedWindow){
      focusedWindow.toggleDevTools();
    }
  }
];

const mainMenu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(mainMenu);

ipcMain.on('elegirPath',async (e,args)=>{
  const path = (await dialog.showSaveDialog()).filePath;
  e.reply('mandoPath',path);
});
