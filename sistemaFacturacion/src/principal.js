const { ipcRenderer } = require("electron")
const puppetter = require('puppeteer');

ipcRenderer.send('abrir-menu');
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

let vendedores = [];
let vendedor
let acceso
let empresa
const sweet = require('sweetalert2');
const { verEstadoServidorAfip, configAxios, verificarUsuarios } = require("./funciones");


const notificaciones = require('node-notifier');


window.addEventListener('load',async e=>{
    setTimeout(async ()=>{
        const dolarSistema = parseFloat((await axios.get(`${URL}tipoVenta`,configAxios)).data.dolar);
        const dolarBNA = parseFloat((await avisarDolar()).replace(',','.')) + 1;
        
        if (dolarBNA !== dolarSistema) {
            notificaciones.notify({
                title:"Dolares distintos",
                message:`El dolar del sistema: ${dolarSistema} es distinto al dolar de el BNA: ${dolarBNA}`
            });
        }

        vendedores = (await axios.get(`${URL}usuarios`,configAxios)).data;
    },0)
});

const avisarDolar = async()=>{
   const browser = await puppetter.launch();
   const page = await browser.newPage();
   await page.goto('https://www.bna.com.ar/Personas');
    const selector = '.cotizacion';
    const dolares = await page.evaluate(()=>{
        const tr = document.querySelector('.cotizacion tbody tr ');
        return tr.children[2].innerText
    });
    return dolares;
};


const body = document.querySelector('body')
const emitirComprobante = document.querySelector('.emitirComprobante');
const listaPedidos = document.querySelector('.listaPedidos');
const pedidos = document.querySelector('#pedidos');
const verPedidos = document.querySelector('#verPedidos');
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

verPedidos.addEventListener('click',e=>{
    validacionUsuario("pedidos/verPedidos.html");
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

async function validacionUsuario(texto,botones = true) {
    await sweet.fire({
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
                    const vendedorTraido = (await axios.get(`${URL}usuarios/${value}`,configAxios)).data;
                    value === vendedorTraido._id && (vendedor=vendedorTraido.nombre)
                    value === vendedorTraido._id && (acceso = vendedorTraido.acceso)
                    value === vendedorTraido._id && (empresa = vendedorTraido.empresa)
                    if(vendedorTraido){ 
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
       .catch((error)=>{
        console.log(error)
        location.reload()
       })
};

ipcRenderer.on("validarUsuario",(e,args)=>{

        sweet.fire({
            title: "Contraseña",
            input: "password",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed,value})=>{
            if (isConfirmed && value !== "") {
                const usuario = (await axios.get(`${URL}usuarios/${value}`,configAxios)).data;
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
                    }else if(JSON.parse(args) === "cambioCodigo"){
                        ipcRenderer.send('abrir-ventana','productos/cambioCodigo.html');
                    }
                }else{
                    sweet.fire({title:"Contraseña Incorrecta"})
                }
            }
        })
});

ipcRenderer.on('cambioCodigo',async(e,args)=>{
    vendedor = await verificarUsuarios();
    ipcRenderer.send('abrir-ventana-argumentos',{
        path:'productos/cambioCodigo.html',
        vendedor:JSON.stringify(vendedor)
    });
});

ipcRenderer.on('aumPorcentaje',async(e,args)=>{
    vendedor = await verificarUsuarios();
    ipcRenderer.send('abrir-ventana-argumentos',{
        path:'productos/aumPorcentaje.html',
        vendedor:JSON.stringify(vendedor),
        width:700,
        height:300
    })
})

ipcRenderer.on('abrir-prestamo',(e)=>{
    validacionUsuario("emitirComprobante/emitirComprobante.html",false);
});

ipcRenderer.on('ver-prestamos',e=>{
    location.href = 'prestamos/verPrestamos.html'
});

ipcRenderer.on('ver-prestamos-anulados',e=>{
    location.href = 'prestamos/anulados.html'
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

ipcRenderer.on('actualización_disponible',()=>{
    console.log("a")
})


