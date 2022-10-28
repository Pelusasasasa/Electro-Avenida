const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

const { cerrarVentana } = require("../assets/js/globales")

const h1 = document.querySelector('h1');

const fecha = document.getElementById('fecha');
const nro_comp = document.getElementById('nro_comp');
const rSocial = document.getElementById('rSocial');
const concepto = document.getElementById('concepto');
const imp = document.getElementById('imp');


const aceptar = document.querySelector('.aceptar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

window.addEventListener('load',e=>{
    cerrarVentana();

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    month = month<10 ? `0${month}` : month;
    day = day<10 ? `0${day}` : day;

    fecha.value = `${year}-${month}-${day}`

});

//cuando escribimos en el nro de comprobante se pone un guion despues de 4 numeros
nro_comp.addEventListener('keyup',e=>{
    if (e.target.value.length === 5 && e.keyCode !== 8) {
        nro_comp.value = nro_comp.value + '-';
    }
    if (e.keyCode === 13) {
        rSocial.focus();
    }
});

aceptar.addEventListener('click',async e=>{
    const factura = {};
    factura.nro_comp = nro_comp.value;
    factura.rSoc = rSocial.value.toUpperCase();
    factura.imp = imp.value;
    factura.concepto = concepto.value.toUpperCase();
    factura.fecha = fecha.value;

    await axios.post(`${URL}facturas`,factura);

    window.close();
});

modificar.addEventListener('click',async e=>{
    const factura = {};
    factura.nro_comp = nro_comp.value;
    factura.rSoc = rSocial.value.toUpperCase();
    factura.imp = imp.value;
    factura.concepto = concepto.value.toUpperCase();
    factura.fecha = fecha.value;

    await axios.put(`${URL}facturas/id/${modificar.id}`,factura);

    window.close();

});

salir.addEventListener('click',e=>{
    window.close();
});

rSocial.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        concepto.focus();
    }
});

concepto.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
        imp.focus();
    }
});

imp.addEventListener('keyup',e=>{
    if (e.keyCode === 13) {
       aceptar.focus();
    }
});

nro_comp.addEventListener('focus',e=>{
    nro_comp.select();
});

rSocial.addEventListener('focus',e=>{
    rSocial.select();
});

concepto.addEventListener('focus',e=>{
    concepto.select();
});

imp.addEventListener('focus',e=>{
    imp.select();
});



ipcRenderer.on('recibir-informacion',async(e,args)=>{
    h1.innerHTML = "MODIFICAR FACTURA";

    aceptar.classList.add('none');
    modificar.classList.remove('none');
    modificar.id = args;

    const factura = (await axios.get(`${URL}facturas/id/${args}`)).data
    llenarInputs(factura)
});

const llenarInputs = async(factura)=>{
    nro_comp.value = factura.nro_comp;
    rSocial.value = factura.rSoc;
    concepto.value = factura.concepto;
    imp.value = factura.imp.toFixed(2);
};