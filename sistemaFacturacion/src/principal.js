const { ipcRenderer } = require("electron")

ipcRenderer.send('abrir-menu');
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;
let vendedores = [];

const notificaciones = require('node-notifier');
window.addEventListener('load',async e=>{
    vendedores = (await axios.get(`${URL}usuarios`)).data;
    // avisarDolar();
});

const avisarDolar = async()=>{
    const dolarSistema = parseFloat((await axios.get(`${URL}tipoVenta`)).data.dolar);
    const dolarInternet = parseFloat((await axios.get('https://api-dolar-argentina.herokuapp.com/api/nacion')).data.venta) + 1;

    if (dolarInternet !== dolarSistema) {
        notificaciones.notify({
            title:"Dolares distintos",
            message:`El dolar del sistema: ${dolarSistema.toFixed(2)} es distinto del dolar de internet: ${dolarInternet.toFixed(2)}`,
            sound:true,
            wait:false
        })
    }
    setTimeout(() => {
        avisarDolar();
    }, 960000);
}

const listaPedidos = document.querySelector('.listaPedidos')
const body = document.querySelector('body')
const emitirComprobante = document.querySelector('.emitirComprobante')
const pedidos = document.querySelector('#pedidos');
const emitirRecibo = document.querySelector('.emitirRecibo');
const resumenCuenta = document.querySelector('.resumenCuenta');
const cuentaCorriente = document.querySelector('.cuentaCorriente');
const notaCredito = document.querySelector('.notaCredito');
const productos = document.querySelector('.productos');
const clientes = document.querySelector('.clientes');
const flecha = document.querySelector('.flecha');
const salir = document.querySelector('.salir');

listaPedidos.addEventListener('click', (e) =>{
    const handlePedidos = document.querySelector('.handlePedidos')
    handlePedidos.classList.toggle('none')
    flecha.classList.toggle('abajo')
    flecha.classList.toggle('arriba')
});

productos.addEventListener('click',e=>{
    validacionUsuario("productos/productos.html");
});

clientes.addEventListener('click',e=>{
    validacionUsuario("clientes/clientes.html")
});

emitirComprobante.addEventListener('click',e=>{
    validacionUsuario("emitirComprobante/emitirComprobante.html")
});

cuentaCorriente.addEventListener('click',e=>{
    validacionUsuario("consultar/cuentaCorriente.html")
});

pedidos.addEventListener('click',e=>{
    validacionUsuario("pedidos/pedidos.html")
});

emitirRecibo.addEventListener('click',e=>{
    validacionUsuario("emitirRecibo/emitirRecibo.html")
});

resumenCuenta.addEventListener('click',e=>{
    window.location = 'resumenCuenta/resumenCuenta.html';
    ipcRenderer.send('cerrar-menu');
});

notaCredito.addEventListener('click',e=>{
    validacionUsuario("emitirComprobante/emitirNotaCredito.html")
});


body.addEventListener('keydown',e=>{
    if (e.key === "F1") {
        validacionUsuario("emitirComprobante/emitirComprobante.html")
    }else if (e.key === "F2") {
        validacionUsuario("productos/productos.html")
    }else if(e.key === "F4"){
        validacionUsuario("pedidos/pedidos.html");
    }else if(e.key === "F3"){
        validacionUsuario("clientes/clientes.html");
    }
});

let vendedor
let acceso
let empresa
const sweet = require('sweetalert2');
const { verEstadoServidorAfip } = require("./funciones");

verEstadoServidorAfip()
async function validacionUsuario(texto,botones = true) {
    sweet.fire({
                title:"Contraseña",
                input:"password",
                showCancelButton: true,
                width:600,
                size:"2rem",
                confirmButtonText: 'Aceptar',
                inputAttributes:{
                    autofocus: "on"
                }
             })
             .then(async ({value})=>{
                if (value === "" || value === undefined) {
                    location.reload();
                }else{
                    vendedores.forEach(e=>{
                        value === e._id && (vendedor=e.nombre)
                        value === e._id && (acceso = e.acceso)
                        value === e._id && (empresa = e.empresa)
                    })
                    if(vendedor !== undefined){ 
                        window.location = `${texto}?vendedor=${vendedor}&acceso=${acceso}&empresa=${empresa}&botones=${botones}`;
                        ipcRenderer.send('cerrar-menu');
                    }else{
                        await sweet.fire({
                            title:"Contraseña incorrecta"
                        })
                        validacionUsuario(texto)
                    }
                }
       })
       .catch(()=>{
        location.reload()
       })
}

ipcRenderer.on("validarUsuario",(e,args)=>{

        sweet.fire({
            title: "Contraseña",
            input: "password",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed,value})=>{
            if (isConfirmed && value !== "") {
                const usuario = (await axios.get(`${URL}usuarios/${value}`)).data;
                let vendedor;
                let acceso;
                if (usuario !== "") {
                    vendedor = usuario.nombre;
                    acceso = usuario.acceso;
                    if(JSON.parse(args) === "aumPorPorcentaje"){
                        (acceso === "0") ? ipcRenderer.send('abrir-ventana',`conexion?${acceso}`) : await sweet.fire({title:"No tiene permisos"})
                    }else if(JSON.parse(args) === "arreglarSaldo"){
                        if (acceso !== "0") {
                            sweet.fire({
                                title:"No tiene permisos",

                            })
                        }else{
                            ipcRenderer.send('abrir-ventana',`clientes/arreglarSaldo.html`);
                        }
                        
                    }else if(JSON.parse(args) === "arreglarCompensada"){
                        console.log(usuario)
                        if (usuario.nombre !== "ELBIO" && usuario.nombre !== "AGUSTIN") {
                            await sweet.fire({
                                title:"No tiene permisos"
                            })
                        }else{
                            ipcRenderer.send('abrir-ventana','clientes/arreglarCompensadaHistorica.html');
                        }
                    }
                }else{
                    sweet.fire({title:"Contraseña Incorrecta"})
                }
            }
        })
});

ipcRenderer.on('abrir-prestamo',(e)=>{
    validacionUsuario("emitirComprobante/emitirComprobante.html",false);
});

salir.addEventListener('click',async e=>{
    sweet.fire({
        title:"Desea Salir ?",
        showCancelButton:true,
        confirmButtonText:"Aceptar",
    }).then(({isConfirmed}) =>{
        if (isConfirmed) {
            window.close();
        }
    })
});



