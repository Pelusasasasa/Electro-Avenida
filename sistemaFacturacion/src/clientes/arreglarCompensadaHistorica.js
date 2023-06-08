const axios = require("axios");
const { copiar, botonesSalir, redondear, cerrarVentana, configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const sweet = require('sweetalert2');

const h1 = document.querySelector('h1');


const codigo = document.getElementById('codigo');
const cliente = document.getElementById('cliente');
const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');


let seleccionado;

window.addEventListener('click',e=>{
    // copiar();
    botonesSalir();
    cerrarVentana();
});

codigo.addEventListener('change',traerCliente);

puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus()
    };
});

numero.addEventListener('change',async e=>{
    const nro_comp = puntoVenta.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
    cuentaTraida = (await axios.get(`${URL}cuentaComp/numeroYCliente/${nro_comp}/${codigo.value.toUpperCase()}`)).data;
    console.log(cuentaTraida);
});


async function traerCliente(e) {
    const clienteTraido = (await axios.get(`${URL}clientes/id/${codigo.value.toUpperCase()}`,configAxios)).data;   
    if (clienteTraido) {
        cliente.value = clienteTraido.cliente;
        puntoVenta.focus();
    }else{
        sweet.fire({
            title:"Cliente no encontrado"
        });
        codigo.value = "";
    }
    
}