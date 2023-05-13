const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');


window.addEventListener('load',e=>{
    const hoy = new Date();
    const fechaArgentina = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString();
    desde.value = fechaArgentina.slice(0,10);
    hasta.value = fechaArgentina.slice(0,10);

    traerPrestamosAnulados();
});


async function traerPrestamosAnulados() {
    const prestamos = (await axios.get(`${URL}prestamos/anulados/${desde.value}/${hasta.value}`)).data;
    console.log(prestamos)
}