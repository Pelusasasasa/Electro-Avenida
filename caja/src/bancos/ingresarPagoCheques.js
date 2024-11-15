const axios = require("axios");
require('dotenv').config();
const URL = process.env.URL;

const { cerrarVentana, configAxios } = require("../assets/js/globales");
const sweet = require('sweetalert2');


const numero = document.getElementById('numero');
const entreg = document.getElementById('entreg');
const banco = document.getElementById('banco');
const fechaCheque = document.getElementById('fechaCheque');
const importe = document.getElementById('importe');
const fechaPago = document.getElementById('fechaPago');
const aceptar = document.getElementById('aceptar');
const cancelar = document.getElementById('cancelar');

let cheque;

window.addEventListener('load',e=>{
    cerrarVentana();
});

numero.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        entreg.focus();
        cheque = (await axios.get(`${URL}cheques/numero/${numero.value}`,configAxios)).data;
        listarCheque(cheque);
    };
});

aceptar.addEventListener('click',async e=>{
    cheque.fechaPago = fechaPago.value;
    try {
        await axios.put(`${URL}cheques/id/${cheque._id}`,cheque,configAxios);
        window.close();
    } catch (error) {
     sweet.fire({
        title:"No se puedo cargar la fecha de pago"
     });
     console.log(error)
    }
});

entreg.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        banco.focus();
    };
});

banco.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaCheque.focus();
    };
});

fechaCheque.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        importe.focus();
    };
});

importe.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaPago.focus();
    };
});

fechaPago.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        aceptar.focus();
    };
});

const listarCheque = async(cheque)=>{
    const fecha = cheque.f_cheque.slice(0,10);
    entreg.value = cheque.entreg_a;
    banco.value = cheque.banco;
    fechaCheque.value = fecha;
    importe.value = cheque.i_cheque;
};