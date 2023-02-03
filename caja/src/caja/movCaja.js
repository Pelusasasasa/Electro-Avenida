function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


const {alerta} = require('../assets/js/globales');
const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;
const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');

const inputFecha = document.querySelector('#fecha');
const punto = document.querySelector('#punto');
const numero = document.querySelector('#numero');
const tipoMovimiento = document.querySelector('#tipoMovimiento');
const tipoCuenta = document.querySelector('#tipoCuenta');
const descripcion = document.querySelector('#descripcion');
const importe = document.querySelector('#importe');

const aceptar = document.querySelector('.aceptar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

const hoy = new Date();
let date = hoy.getDate();
let month = hoy.getMonth() + 1;
let year = hoy.getFullYear();

date = date<10 ? `0${date}` : date;
month = month===13 ? 1 : month;
month = month<10 ? `0${month}` : month;


inputFecha.value = `${year}-${month}-${date}`;

fecha.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     punto.focus();
    }
});

punto.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     numero.focus();
    }
});

numero.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     tipoMovimiento.focus();
    }
});

tipoMovimiento.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     e.preventDefault();
     tipoCuenta.focus();
    }
});

tipoCuenta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     e.preventDefault();
     descripcion.focus();
    }
});

descripcion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     importe.focus();
    }
});

importe.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
     if (aceptar.classList.contains('none')) {
        modificar.focus();
     }else{
        aceptar.focus();
     }
    }
});

punto.addEventListener('focus',e=>{
    punto.select();
});

numero.addEventListener('focus',e=>{
    numero.select();
});

descripcion.addEventListener('focus',e=>{
    descripcion.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});

window.addEventListener('load',async e=>{
    const informacion = getParameterByName("informacion");
    let movimiento;
    if (informacion) {
        aceptar.classList.add('none');
        modificar.classList.remove('none');
    }
    const cuentas = (await axios.get(`${URL}cuentas`)).data;
    for(let cuenta of cuentas){
        const option = document.createElement('option');
        option.text = cuenta.desc;
        option.value = cuenta.cod;
        tipoCuenta.appendChild(option);
    }
});


aceptar.addEventListener('click',async e=>{
    if (tipoMovimiento.value === "") {
        await alerta("Seleccionar un tipo de movimiento");
        tipoMovimiento.focus();
    }else if(parseFloat(importe.value) === 0){
        await alerta("Poner Importe distinto de cero")
        importe.focus();
    }else{
        const movimientoCaja = {};
        const date = fecha.value.split('-',3);
        movimientoCaja.fecha = new Date(date[0],date[1] - 1,date[2],"15");
        movimientoCaja.imp = importe.value;
        movimientoCaja.cuenta = document.querySelector('option[value = ' + tipoCuenta.value + ']').innerHTML;
        movimientoCaja.idCuenta = tipoCuenta.value;
        movimientoCaja.desc = descripcion.value;
        movimientoCaja.tMov = tipoMovimiento.value;
        movimientoCaja.nro_comp = punto.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
        movimientoCaja.pasado = true;
        try {
            await axios.post(`${URL}movCajas`,movimientoCaja);
            // window.close();
            location.reload();
        } catch (error) {
            alerta("No se pudo cargar el movimiento")
        }
    }
});

modificar.addEventListener('click',async e=>{
    const movimiento = {};
    movimiento.fecha = fecha.value;
    movimiento.nro_comp =  punto.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
    movimiento.tMov = tipoMovimiento.value;
    movimiento.idCuenta = tipoCuenta.value;
    movimiento.cuenta = document.querySelector('option[value = ' + tipoCuenta.value + ']').innerHTML;
    movimiento.desc = descripcion.value;
    movimiento.imp = importe.value;
    try {
        await axios.put(`${URL}movCajas/id/${modificar.id}`,movimiento);
        window.close();
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar"
        });
        console.log(error)
    }
})

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});

salir.addEventListener('click',e=>{
    window.close();
});

const listarMovimiento = (movimiento)=>{
    const date = movimiento.fecha.slice(0,10);
    inputFecha.value = date
    punto.value = movimiento.nro_comp.slice(0,4);
    numero.value = movimiento.nro_comp.slice(5,14)
    tipoMovimiento.value = movimiento.tMov;
    tipoCuenta.value = movimiento.idCuenta;
    descripcion.value = movimiento.desc;
    importe.value = movimiento.imp.toFixed(2);
}

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    aceptar.classList.add('none');
    modificar.classList.remove('none')
    modificar.id = args
    movimiento = (await axios.get(`${URL}movCajas/id/${args}`)).data;
    listarMovimiento(movimiento);
})