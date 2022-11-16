

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

//Provedor
const provedores = document.getElementById('provedores');
const saldo = document.getElementById('saldo');
const condIva = document.getElementById('condIva');
const cuit = document.getElementById('cuit');

//comprobante
const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const tipo = document.getElementById('tipo');
const importe = document.getElementById('importe');

window.addEventListener('load',async e=>{
    let provedores = (await axios.get(`${URL}provedor`)).data;
    listarProductos(provedores);
});

provedores.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        console.log(provedores.value)
        const provedor = (await axios.get(`${URL}provedor/codigo/${provedores.value}`)).data;
        saldo.value = provedor.saldo;
        condIva.value = provedor.condIva
        cuit.value = provedor.cuit;
    }
});

const listarProductos = (lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.codigo;
        option.text = elem.provedor;

        provedores.appendChild(option);
    }
};


//INPUTS Y SELECT DE COMPROBANTES
puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus();
    }
});

numero.addEventListener('keypress',async e=>{
    const punto = puntoVenta.value.padStart(4,'0');
    const num = numero.value.padStart(8,'0');
    const a = (await axios.get(`${URL}dat_comp/nro_Comp/${punto + '-' + num}`)).data;
    console.log(a)
    if (e.keyCode === 13) {
        tipo.focus();

    }
});

tipo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        importe.focus();
    }
});

importe.addEventListener('keypress',e=>{
    // const 
});

puntoVenta.addEventListener('focus',e=>{
    puntoVenta.select();
});

numero.addEventListener('focus',e=>{
    numero.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});

