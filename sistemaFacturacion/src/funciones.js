const {BrowserWindow, ipcRenderer} = require('electron');
const url = require('url');
const path = require('path');
const { clipboard } = require('electron/common');

const axios = require('axios');
require('dotenv').process;
const URL = process.env.URL;
const sweet = require('sweetalert2');

let Afip = require('@afipsdk/afip.js');
let afip = new Afip({ CUIT: 27165767433 });
const prueba = btoa(`electroAvenida:Elbio935`);


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
function abrirVentana(texto,width,height,reinicio = false,informacion = "",vendedor){
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
      });
      nuevaVentanaDos.loadURL(url.format({
          pathname: path.join(__dirname, `./${texto}`),
          protocol: 'file',
          slashes: true
      }));
    nuevaVentanaDos.on('ready-to-show',()=>{
        nuevaVentanaDos.webContents.send('informacion',informacion)
    });
    nuevaVentanaDos.setMenuBarVisibility(false)
    nuevaVentanaDos.on('close',e=>{
        nuevaVentanaDos = null;
        reinicio !== "noReinician" && ventanaPrincipal.reload()
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
          nuevaVentana.webContents.send('informacion',informacion);
          vendedor && nuevaVentana.webContents.send('vendedor',vendedor);
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
};

const verCodComp = (tipoComp,condicionIva) =>{
    if(tipoComp === "Recibos"){
        if(condicionIva === "Inscripto"){
            return  4
        }else{
            return 9
        }
    }else if(tipoComp === "Nota Credito"){
        if(condicionIva === "Inscripto"){
            return 3
        }else{
            return 8
        }
    }else if(tipoComp === "Ticket Factura"){
        if (conIva.value === "Inscripto") {
            return 1
        } else {
            return 6
        }
    }else{
        return 0
    }
};

//Generamos el qr
async function generarQR(texto) {
    const qrCode = require('qrcode');
    const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
    const QR = await qrCode.toDataURL(url);
    return QR;
}

const verEstadoServidorAfip = async()=>{
    const serverStatus = await afip.ElectronicBilling.getServerStatus();
    console.log(serverStatus);
}

//funcion que hace la factura para subir a la afip directamente
const subirAAfip = async(venta)=>{
    alerta.children[1].children[0].innerHTML = "Esperando Confirmacion de AFIP";
    const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    const serverStatus = await afip.ElectronicBilling.getServerStatus();
    console.log(serverStatus)

    let ultimoElectronica = await afip.ElectronicBilling.getLastVoucher(5,parseFloat(venta.cod_comp));

    let data = {
        'CantReg': 1,
        'CbteTipo': venta.cod_comp,
        'Concepto': 1,
        'DocTipo': venta.cod_doc,
        'DocNro': venta.dnicuit,
        'CbteDesde': ultimoElectronica + 1,
        'CbteHasta': ultimoElectronica+1,
        'CbteFch': parseInt(fecha.replace(/-/g, '')),
        'ImpTotal': venta.precioFinal,
        'ImpTotConc': 0,
        'ImpNeto': parseFloat((venta.gravado21+venta.gravado105).toFixed(2)),
        'ImpOpEx': 0,
        'ImpIVA': parseFloat((venta.iva21+venta.iva105).toFixed(2)), //Importe total de IVA
        'ImpTrib': 0,
        'MonId': 'PES',
        'PtoVta': 5,
        'MonCotiz' 	: 1,
        'Iva' 		: [],
        }
        
        if (venta.iva105 !=0 ) {
            data.Iva.push({
                    'Id' 		: 4, // Id del tipo de IVA (4 para 10.5%)
                    'BaseImp' 	: venta.gravado105, // Base imponible
                    'Importe' 	: venta.iva105 // Importe 
            })
        }
        if (venta.iva21 !=0 ) {
            data.Iva.push({
                    'Id' 		: 5, // Id del tipo de IVA (5 para 21%)
                    'BaseImp' 	: venta.gravado21, // Base imponible
                    'Importe' 	: venta.iva21 // Importe 
            })
        };
        console.log(data);
        console.log(venta);
        const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
        alerta.children[1].children[0].innerHTML = "Venta en AFIP Aceptada";
        const qr = {
            ver: 1,
            fecha: fecha,
            cuit: 27165767433,
            ptoVta: 5,
            tipoCmp: venta.cod_comp,
            nroCmp: ultimoElectronica + 1,
            importe: data.ImpTotal,
            moneda: "PES",
            ctz: 1,
            tipoDocRec: data.DocTipo,
            nroDocRec: parseInt(data.DocNro),
            tipoCodAut: "E",
            codAut: parseFloat(res.CAE)
        };
        const textoQR = btoa(JSON.stringify(qr));//codificamos lo que va en el QR
        const QR = await generarQR(textoQR);
        return {
            QR,
            cae:res.CAE,
            vencimientoCae:res.CAEFchVto,
            texto:textoQR,
            numero:ultimoElectronica + 1
        }
};

const ponerNotificaciones = async(texto)=>{
    const notificacion = document.querySelector('.notificacion');
    notificacion.addEventListener('animationend',(e)=>{
        if (e.animationName === 'cierre') {
            notificacion.classList.add('none');
        }
    });

    notificacion.classList.remove('none');

    document.getElementById('notificacion-texto').innerText = texto;
    document.getElementById('notificacion-close').addEventListener('click',()=>{notificacion.classList.add('cerrando')});

    setInterval(() => {
        notificacion.classList.add('cerrando');
    }, 5000);
};

const ultimasFacturas = async(puntoVenta,tipoComp)=>{
    const lastVoucher = await afip.ElectronicBilling.getLastVoucher(puntoVenta,tipoComp);
    return lastVoucher
};

const verificarUsuarios = async()=>{
    let vendedor;
    await sweet.fire({
        title:"Contraseña",
        showCancelButton:true,
        confirmButtonText:"Aceptar",
        input:"password"
    }).then(async ({isConfirmed,value})=>{
        if (isConfirmed) {
            vendedor = (await axios.get(`${URL}usuarios/${value}`,configAxios)).data;
        }
    })
    return vendedor
};

const ponerEnCuentaCorrienteCompensada = async(codigo,cliente,tipo_comp,nro_comp,importe,saldo,vendedor,maquina)=>{
    const cuenta = {};
    cuenta.codigo = codigo;
    cuenta.cliente = cliente;
    cuenta.tipo_comp = tipo_comp;
    cuenta.nro_comp = nro_comp;
    cuenta.importe = importe * -1;
    cuenta.saldo = saldo * -1;
    cuenta.vendedor = vendedor;4
    cuenta.maquina = maquina;
    console.log(cuenta)

    await axios.post(`${URL}cuentaComp`,cuenta,configAxios);
}

const generarMovimientoCaja = async (fecha,tMov,nro_comp,cuenta,idCuenta,imp,desc,codigo,cliente,vendedor,maquina)=>{
    const movimiento = {};
    movimiento.fecha = fecha;
    movimiento.tMov = tMov;
    movimiento.nro_comp = nro_comp;
    movimiento.cuenta = cuenta.toUpperCase();
    movimiento.idCuenta = idCuenta;
    movimiento.imp = imp;
    movimiento.desc = desc.toUpperCase();
    movimiento.codigo = codigo,
    movimiento.cliente = cliente;
    movimiento.vendedor = vendedor;
    movimiento.maquina = maquina;
    try {
        await axios.post(`${URL}movCajas`,movimiento,configAxios);
    } catch (error) {
        console.log(errero)
        await sweet.fire({
            title:"no se pudo cargar el movimiento de caja"
        });
    }
};

const verTipoPago = async(vendedor)=>{
    let retorno;
    await sweet.fire({
        title:"Contado",
        input:"radio",
        inputOptions:inputOptions,
        inputValue:"Efectivo",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(({isConfirmed,value})=>{
        if (isConfirmed) {
            retorno = value;
        }
    });
    if (retorno === "Tarjeta") {
        ipcRenderer.send('abrir-ventana-tarjeta',{
            path:"./utilidad/cargarTarjeta.html",
            height:500,
            width:500,
            reinicio:"noReinician",
            informacion: JSON.stringify({
                imp:parseFloat(total.value),
                vendedor:vendedor
            })
        });    
    }else if(retorno === "Cheque") {
        ipcRenderer.send('abrir-ventana-tarjeta',{
            path:"./utilidad/agregarCheque.html",
            height:600,
            width:500,
            reinicio:"noReinician",
            informacion: JSON.stringify({
                imp:parseFloat(total.value),
                vendedor:vendedor,
                cliente:nombre.value,
                dom:direccion.value,
                tel:telefono.value,
                loc:localidad.value
            })
        });
    }
};

const configAxios = {
    
    headers:{
        "ngrok-skip-browser-warning": "69420",
        "Authorization": `Basic ${prueba}`
    }
};

function verNombrePc(){
    require('hostname-patcher');
    const os = require('os');
    return os.hostname();
}

function clickderecho(e,texto){
    const cordenadas = {
        x: e.clientX,
        y: e.clientY,
        ventana: texto
    }

    ipcRenderer.send('mostrar-menu',cordenadas);
};


module.exports = {
    redondear,
    abrirVentana,
    copiar,
    recorrerFlechas,
    inputOptions,
    cerrarVentana,
    botonesSalir,
    subirAAfip,
    verCodComp,
    ultimasFacturas,
    verificarUsuarios,
    ponerEnCuentaCorrienteCompensada,
    generarMovimientoCaja,
    verTipoPago,
    verEstadoServidorAfip,
    configAxios,
    verNombrePc,
    clickderecho,
    ponerNotificaciones
}