const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const { clipboard } = require('electron/common');

function redondear(numero,decimales){
    const signo = numero >= 0 ? 1 : -1;
    return(Math.round((numero * Math.pow(10,decimales)) + (signo * 0.0001)) / Math.pow(10,decimales)).toFixed(decimales);
}

const copiar = () =>{
    document.addEventListener('keydown',e=>{
        if (e.keyCode === 17) {
            document.addEventListener('keydown',event=>{

                if (event.keyCode === 67) {
                    clipboard.writeText(document.querySelector('.subSeleccionado').innerHTML)
                }
            },{once:true});
        }
    });
}

const recorrerFlechas = async (e) => {
    // document.addEventListener('keyup',async e=>{
        let seleccionado = document.querySelector('.seleccionado');
        let subSeleccionado = document.querySelector('.subSeleccionado');
        if (e.keyCode === 37 && subSeleccionado.previousElementSibling) {
            subSeleccionado.classList.remove('subSeleccionado');
            subSeleccionado = subSeleccionado.previousElementSibling;
            subSeleccionado.classList.add('subSeleccionado');
        }else if(e.keyCode === 39 && subSeleccionado.nextElementSibling){
            subSeleccionado.classList.remove('subSeleccionado');
            subSeleccionado = subSeleccionado.nextElementSibling;
            subSeleccionado.classList.add('subSeleccionado');
        }else if(e.keyCode === 38 && seleccionado.previousElementSibling){
            let i = 0;
            let aux = 0;
            let tds = document.querySelectorAll('.seleccionado td,.seleccionado th');
            for await(let td of tds){
                if (td.classList.contains('subSeleccionado')) {
                    aux=i;
                }
                i++;
            }

            seleccionado.classList.remove('seleccionado');
            seleccionado = seleccionado.previousElementSibling;
            seleccionado.classList.add('seleccionado');

            subSeleccionado.classList.remove('subSeleccionado');
            subSeleccionado = seleccionado.children[aux];
            subSeleccionado.classList.add('subSeleccionado');
        }else if(e.keyCode === 40 && seleccionado.nextElementSibling){
            let i = 0;
            let aux = 0;
            let tds = document.querySelectorAll('.seleccionado td,.seleccionado th');
            for await(let td of tds){
                if (td.classList.contains('subSeleccionado')) {
                    aux=i;
                }
                i++;
            }

            seleccionado.classList.remove('seleccionado');
            seleccionado = seleccionado.nextElementSibling;
            seleccionado.classList.add('seleccionado');

            subSeleccionado.classList.remove('subSeleccionado');
            subSeleccionado = seleccionado.children[aux];
            subSeleccionado.classList.add('subSeleccionado');
        }
        // subSeleccionado && subSeleccionado.scrollIntoView({
        //     block:"center",
        //     inline:'center',
        //     behavior:"smooth"
        //   });
        return subSeleccionado;
    // });
    
};



  //Para abrir todas las ventanas
function abrirVentana(texto,width,height,reinicio,informacion = ""){
  if (texto === "resumenCuenta") {
      nuevaVentana = new BrowserWindow({
          width: 800,
          height: 500,
          parent:ventanaPrincipal,
          modal:true,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })
      nuevaVentana.loadURL(url.format({
          pathname: path.join(__dirname, `resumenCuenta/resumenCuenta.html`),
          protocol: 'file',
          slashes: true
      }));
      nuevaVentana.setMenuBarVisibility(false)
      nuevaVentana.on('close', function (event) {
          nuevaVentana = null
      })
  }else if(texto === "clientes"){
      nuevaVentana = new BrowserWindow({
          parent:ventanaPrincipal,
          modal:true,
          width: 1200,
          height: 1200,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })

      nuevaVentana.loadURL(url.format({
          pathname: path.join(__dirname, `emitirComprobante/clientes.html`),
          protocol: 'file',
          slashes: true
      }));
      nuevaVentana.setMenuBarVisibility(false)
      nuevaVentana.on('close', function (event) {
          nuevaVentana = null
      })
  }else if(texto === "productos"){
      nuevaVentana = new BrowserWindow({
          parent:ventanaPrincipal,
          modal:true,
          width: 1200,
          height: 600,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })

      nuevaVentana.loadURL(url.format({
          pathname: path.join(__dirname, `emitirComprobante/productos.html`),
          protocol: 'file',
          slashes: true
      }));

      nuevaVentana.on('close', function (event) {
          nuevaVentana= null
      });
      nuevaVentana.on('ready-to-show',()=>{
      })
      nuevaVentana.setMenuBarVisibility(false)
  }else if(texto === "emitirComprobante/emitirComprobante.html"){
      nuevaVentanaDos = new BrowserWindow({
          parent:ventanaPrincipal,
          modal:true,
          width: width,
          height: height,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })
      nuevaVentanaDos.loadURL(url.format({
          pathname: path.join(__dirname, `./${texto}`),
          protocol: 'file',
          slashes: true
      }));
      nuevaVentanaDos.setMenuBarVisibility(false)
      nuevaVentanaDos.on('close',e=>{
          nuevaVentanaDos = null;
          reinicio !== "noReinician" && ventanaPrincipal.reload()
      })
  }else if(texto.includes("usuarios")){
      const a = texto.split('?')[1];
      nuevaVentana = new BrowserWindow({
          width: 500,
          parent:ventanaPrincipal,
          modal:true,
          height: 450,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })
      nuevaVentana.loadURL(url.format({
          pathname: path.join(__dirname, `usuarios/usuarios.html`),
          protocol: 'file',
          slashes: true
      }));
      nuevaVentana.setMenuBarVisibility(false)
      nuevaVentana.on('close',e=>{
          nuevaVentana = null
      })
      nuevaVentana.on('ready-to-show',()=>{
          nuevaVentana.webContents.send('acceso',JSON.stringify(a));
      });
  }else{
      nuevaVentana = new BrowserWindow({
          parent:ventanaPrincipal,
          modal:true,
          width: width,
          height: height,
          webPreferences: {
              contextIsolation: false,
              nodeIntegration: true
          }
      })
      nuevaVentana.loadURL(url.format({
          pathname: path.join(__dirname, `./${texto}`),
          protocol: 'file',
          slashes: true
      }));
      nuevaVentana.on('ready-to-show',()=>{
          nuevaVentana.webContents.send('informacion',informacion)
      })
      nuevaVentana.setMenuBarVisibility(false)
      nuevaVentana.on('close',e=>{
          nuevaVentana = null;
          reinicio !== "noReinician" && ventanaPrincipal.reload()
      });
  }
  nuevaVentana && nuevaVentana.on('close',()=>{
      nuevaVentana = null;
  })

}


const inputOptions = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        'Efectivo': 'Efectivo',
        'Tarjeta': 'Tarjeta',
        'Cheque': 'Cheque'
      })
    }, 1000)
});

const cerrarVentana = async()=>{
    document.addEventListener('keyup',e=>{
        if (e.keyCode === 27) {
            window.close();
        }
    });
}

const botonesSalir = async()=>{
    const salir = document.querySelector('.salir');
    salir.addEventListener('click',e=>{
        window.close();
    });
    
}


  module.exports = {redondear,abrirVentana,copiar,recorrerFlechas,inputOptions,cerrarVentana,botonesSalir}