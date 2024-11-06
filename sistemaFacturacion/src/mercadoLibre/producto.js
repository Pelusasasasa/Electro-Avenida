require('dotenv').config();
const URL = process.env.URL ;
const axios = require('axios');

const codigoML = document.getElementById('codigoML');
const codigoInterno = document.getElementById('codigoInterno');
const descripcion = document.getElementById('descripcion');
const precioML = document.getElementById('precioML');
const stockML = document.getElementById('stockML');

const agregar = document.getElementById('agregar');
const salir = document.getElementById('salir');






codigoML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        codigoInterno.focus();
    };
});

codigoInterno.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        descripcion.focus();
    };
});

descripcion.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        precioML.focus();
    };
});

precioML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        stockML.focus();
    };
});

stockML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        agregar.focus();
    };
});

salir.addEventListener('click', e => {
    window.close();
})