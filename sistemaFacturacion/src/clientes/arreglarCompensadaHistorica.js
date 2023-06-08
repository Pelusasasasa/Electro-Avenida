const axios = require("axios");
const { copiar, botonesSalir, redondear, cerrarVentana } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const sweet = require('sweetalert2');

const compensada = document.querySelector('.compensada');
const historica = document.querySelector('.historica');

const h1 = document.querySelector('h1');
const labelImporte = document.querySelector('[for="importe"]');
const labelPagado = document.querySelector('[for="pagado"]');

const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const tbody = document.querySelector('tbody');

let seleccionado;

window.addEventListener('click',e=>{
    // copiar();
    botonesSalir();
    cerrarVentana();
})

numero.addEventListener('change',async e=>{
    const nro_comp = puntoVenta.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
    cuentaTraida = (await axios.get(`${URL}cuentaComp/numero/${nro_comp}`)).data;
    console.log(cuentaTraida);
});