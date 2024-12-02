const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const {redondear, cerrarVentana, configAxios} = require('../assets/js/globales');

const selectTarjeta = document.querySelector('#tarjeta');
const selectVendedor = document.querySelector('#vendedor');
const cliente = document.querySelector('#cliente');
const fecha = document.querySelector('#fecha');
const importe = document.querySelector('#importe');
const tipoComprobante = document.querySelector('#tipoComprobante');

const aceptar = document.querySelector('.aceptar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

let cerrar = false;

const hoy = new Date();
let date = hoy.getDate();
let month = hoy.getMonth() + 1;
let year = hoy.getFullYear();
date = date<10 ? `0${date}` : date;
month = month===13 ? 1 : month;
month = month<10 ? `0${month}` : month;
fecha.value = `${year}-${month}-${date}`;

let vendedorForSelect;
let tarjeta;

window.addEventListener('load',async e=>{
    const tipos = (await axios.get(`${URL}tipoTarjetas`,configAxios)).data;
    const usuarios = (await axios.get(`${URL}usuarios`,configAxios)).data;
    for await(let usuario of usuarios){
        const option = document.createElement('option');
        option.value = usuario.nombre;
        option.text = usuario.nombre.toUpperCase();
        selectVendedor.appendChild(option);
        // usuario.nombre === "ELBIO" && (selectVendedor.value = "ELBIO");
    }
    for await(let tipo of tipos){
        const option = document.createElement('option');
        option.value = tipo.nombre;
        option.text = tipo.nombre.toUpperCase();
        selectTarjeta.appendChild(option);
    }

    if(vendedorForSelect){
        selectVendedor.value = vendedorForSelect;
    }
    tarjeta && listarTarjeta(tarjeta);
    selectTarjeta.value = "";
});

fecha.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        cliente.focus();
    }
});

cliente.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        selectTarjeta.focus();
    }
});

selectTarjeta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        importe.focus();
    }
});

importe.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        tipoComprobante.focus();
    }
});

tipoComprobante.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        selectVendedor.focus();
    }
});

selectVendedor.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        if (aceptar.classList.contains('none')) {
            modificar.focus();
        }else{
            aceptar.focus();
        }
    }
});

ipcRenderer.on('cerrar-ventana',async(e,args)=>{
    cerrar = args;
});

ipcRenderer.on('recibir-informacion',async(e,args)=>{
    tarjeta = (await axios.get(`${URL}tarjetas/id/${args}`,configAxios)).data;
    modificar.classList.remove('none');
    aceptar.classList.add('none');
    modificar.id = args;
    listarTarjeta(tarjeta)
});

ipcRenderer.on('informacionAgregar',(e,args)=>{
    const {imp,vendedor,cliente: clienteTraido,tipo} = args;
    cliente.value = clienteTraido;
    importe.value = imp.toFixed(2);
    tipoComprobante.value = tipo;
    vendedorForSelect = vendedor;
});

const listarTarjeta = (tarjeta)=>{
    const date = tarjeta.fecha.slice(0,10).split('-',3);
    fecha.value = `${date[0]}-${date[1]}-${date[2]}`;
    selectTarjeta.value = tarjeta.tarjeta;
    cliente.value = tarjeta.cliente;
    importe.value = redondear(tarjeta.imp,2);
    tipoComprobante.value = tarjeta.tipo_comp;
    selectVendedor.value = tarjeta.vendedor;
}

importe.addEventListener('focus',e=>{
    importe.select();
});

aceptar.addEventListener('click',async e=>{
    const tarjeta = {} ;
    const now = new Date();
    const fechaArgentina = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    tarjeta.fecha = fechaArgentina;
    tarjeta.tarjeta = selectTarjeta.value;
    tarjeta.imp = importe.value = "" ? 0 : importe.value;
    tarjeta.cliente = cliente.value.toUpperCase();
    tarjeta.vendedor = selectVendedor.value;
    tarjeta.tipo = "Tarjeta";
    tarjeta.tipo_comp = tipoComprobante.value;

    if (selectTarjeta.value  === "") {
     await sweet.fire({
        title:"Necesita elegir una tarjeta",
        returnFocus:false
    });
     selectTarjeta.focus();
    }else if(parseFloat(importe.value) === 0){
     await sweet.fire({
        title:"El importe tiene que ser distinto de 0",
        returnFocus:false
    });
    importe.focus();
    }else{
        try {
            await axios.post(`${URL}tarjetas`,tarjeta,configAxios);
            await ipcRenderer.send('enviar-info-ventana-principal',tarjeta);
            if (cerrar) {
                window.close();
            }else{
                location.reload();
            }
            
        } catch (error) {
            console.log(error)
            await sweet.fire({
                title:"No se pudo cargar la tarjeta"
            });
        };
    };

});

modificar.addEventListener('click',async e=>{
    const tarjeta = {};
    tarjeta.fecha = fecha.value;
    tarjeta.tarjeta = selectTarjeta.value;
    tarjeta.imp = redondear(importe.value,2);
    tarjeta.vendedor = selectVendedor.value;
    tarjeta.cliente = cliente.value;
    try {
        await axios.put(`${URL}tarjetas/id/${modificar.id}`,tarjeta,configAxios);
        window.close();
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se puede modificar la tarjeta"
        })
    }


});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});