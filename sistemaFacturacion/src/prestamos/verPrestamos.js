const axios = require('axios');
require('dotenv');
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const tbody = document.querySelector('tbody');

window.addEventListener('load',async e=>{
    const hoy = new Date();
    const fechaArgentina = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString();
    desde.value = fechaArgentina.slice(0,10);
    hasta.value = fechaArgentina.slice(0,10);
    const prestamos = (await axios.get(`${URL}prestamos/betweenDates/${desde.value}/${hasta.value}`)).data;
    listarPrestamos(prestamos);
});

async function listarPrestamos(lista) {
    console.log(lista)
};