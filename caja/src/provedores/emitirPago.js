

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const provedores = document.getElementById('provedores');
const saldo = document.getElementById('saldo');
const condIva = document.getElementById('condIva');
const cuit = document.getElementById('cuit');


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