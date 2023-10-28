const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const tbody = document.querySelector('tbody');

const modificar = document.getElementById('modificar');
const exportar = document.getElementById('exportar');
const salir = document.getElementById('salir');

window.addEventListener('load',cargarPagina);


async function cargarPagina(){
    const productos = (await axios.get(`${URL}productos/stockCero`)).data;
    console.log(productos)

}