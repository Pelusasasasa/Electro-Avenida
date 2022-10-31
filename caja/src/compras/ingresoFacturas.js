const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const {redondear} = require('../assets/js/globales');

const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const imputado = document.getElementById('imputado');
const empresa = document.getElementById('empresa');

const factura = document.getElementById('factura');
const notaCredito = document.getElementById('notaCredito');
const presupuesto = document.getElementById('presupuesto');

const fechaComp = document.getElementById('fechaComp');
const fechaImput = document.getElementById('fechaImput');
const fechaVencimiento = document.getElementById('fechaVencimiento');
const fechaVencimientoCAI = document.getElementById('fechaVencimientoCAI');

const netoNoGravado = document.getElementById('netoNoGravado');
const netoGravado = document.getElementById('netoGravado');
const iva = document.getElementById('iva');
const numeroIva = document.getElementById('numeroIva');
const percepcionIVA = document.getElementById('percepcionIVA');
const retencionDGR = document.getElementById('retencionDGR');
const percepcionDGR = document.getElementById('percepcionDGR');
const retencionIVA = document.getElementById('retencionIVA');
const total = document.getElementById('total');
const descuentoPor = document.getElementById('descuentoPor');
const descuento = document.getElementById('descuento');
const neto = document.getElementById('neto');



const aceptar = document.querySelector('.aceptar');
const cancelar = document.querySelector('.cancelar');


const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

window.addEventListener('load',async e=>{
    fechaComp.value = `${year}-${month}-${day}`;
    fechaImput.value  = `${year}-${month}-${day}`;
    fechaVencimiento.value = `${year}-${month}-${day}`;
    fechaVencimientoCAI.value = `${year}-${month}-${day}`;

    const cuentas = (await axios.get(`${URL}cuentas`)).data;
    listarCuentas(cuentas);
});



const listarCuentas = async(lista)=>{
    for(let cuenta of lista){
        const option = document.createElement('option');
        option.value = cuenta.cod;
        option.text = cuenta.desc;
        imputado.appendChild(option)
    }
}

puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus();
    }
});

numero.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        imputado.focus();
    }
});

imputado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        empresa.focus();
    }
});

empresa.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        factura.focus();
    }
});

factura.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        notaCredito.focus();
    }
});

notaCredito.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        presupuesto.focus();
    }
});

presupuesto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaComp.focus();
    }
});

fechaComp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaImput.focus();
    }
});

fechaImput.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaVencimiento.focus();
    }
});

fechaVencimiento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaVencimientoCAI.focus();
    }
});

fechaVencimientoCAI.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        netoNoGravado.focus();
    }
}); 

netoNoGravado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        netoGravado.focus();
    }
});

netoGravado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        iva.focus();
    }
});

iva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        numeroIva.value = redondear(parseFloat(netoGravado.value) * parseFloat(iva.value) / 100,2)
        numeroIva.focus();
    }
});

numeroIva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionIVA.focus();
        total.value = parseFloat(netoGravado.value) + parseFloat(numeroIva.value)
    }
});

percepcionIVA.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        retencionDGR.focus();
    }
});

retencionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionDGR.focus();
    }
});

retencionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionDGR.focus();
    }
});

percepcionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
            retencionIVA.focus();
    }
});

retencionIVA.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
            total.focus();
    }
});

total.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        descuentoPor.focus();
    }
});

descuentoPor.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        descuento.focus();
    }
});

descuento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        neto.focus();
    }
});

netoGravado.addEventListener('change',e=>{
    total.value = netoGravado.value
});

percepcionIVA.addEventListener('change',e=>{
    total.value = parseFloat(total.value) + parseFloat(percepcionIVA.value)
});

retencionDGR.addEventListener('change',e=>{
    total.value = parseFloat(total.value) + parseFloat(retencionDGR.value)
});

percepcionDGR.addEventListener('change',e=>{
    total.value = parseFloat(percepcionDGR.value) + parseFloat(total.value);
});

retencionIVA.addEventListener('change',e=>{
    total.value = parseFloat(retencionIVA.value) + parseFloat(total.value);
});

netoGravado.addEventListener('focus',e=>{
    netoGravado.select();
});

percepcionIVA.addEventListener('focus',e=>{
    percepcionIVA.select();
});

retencionDGR.addEventListener('focus',e=>{
    retencionDGR.select();
});

percepcionDGR.addEventListener('focus',e=>{
    percepcionDGR.select();
});

retencionIVA.addEventListener('focus',e=>{
    retencionIVA.select();
});

total.addEventListener('focus',e=>{
    total.select();
});

descuentoPor.addEventListener('focus',e=>{
    descuentoPor.select();
});

descuento.addEventListener('focus',e=>{
    descuento.select();
});

neto.addEventListener('focus',e=>{
    neto.select();
});

descuentoPor.addEventListener('change',e=>{
    descuento.value = redondear(parseFloat(total.value) * parseFloat(descuentoPor.value) / 100,2);
});

descuento.addEventListener('focus',e=>{
    neto.value = redondear(parseFloat(total.value) - parseFloat(descuento.value),2)
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = "../index.html";
    }
});

cancelar.addEventListener('click',e=>{
    location.href = "../index.html"
});