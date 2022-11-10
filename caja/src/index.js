const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}
let ventanaPrincipal
let nuevaVentana

const abrirVentana = (direccion,width,height,reinicio,informacion)=>{
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
    if (informacion) {
      nuevaVentana.webContents.send('recibir-informacion',informacion);
    }
  });

  nuevaVentana.on('closed',()=>{
    nuevaVentana=null;
    if (reinicio) {
      ventanaPrincipal.reload();
    }
  })
  // nuevaVentana.setMenuBarVisibility(false)
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
  const {path,width,height,reinicio,informacion} = args;
  abrirVentana(path,width,height,reinicio,informacion);
}); 

// Lo usamos para cuando alla un cambio en la aplicacion se reinicie
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
};

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
      }
    ]
  },
  {
    label:"Caja",
    submenu:[
      {
        label:"Cobranza Facturas"
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

