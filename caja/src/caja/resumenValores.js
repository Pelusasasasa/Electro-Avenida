const { ipcRenderer } = require("electron");

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const efectivoCaja = document.querySelector('#efectivoCaja');
const chequesCartera = document.querySelector('#chequesCartera');
const cien = document.querySelector('#cien');
const cincuenta = document.querySelector('#cincuenta');
const veinte = document.querySelector('#veinte');
const diez = document.querySelector('#diez');
const monedas = document.querySelector('#monedas');
const guardado = document.querySelector('#guardado');
const uno = document.querySelector('#uno');
const cambioCaja = document.querySelector('#cambioCaja');
const ceroVeinticinco = document.querySelector('#ceroVeinticinco');
const ceroCincuenta = document.querySelector('#ceroCincuenta');
const maleta = document.querySelector('#maleta');



ipcRenderer.on('recibir-informacion',(e,args)=>{
    console.log(args)
});

let ultimos = {};

window.addEventListener('load',async e=>{
    ultimos = (await axios.get(`${URL}ultimos`)).data;
    ponerValores(ultimos)
});


window.addEventListener('beforeunload',async e=>{
    ultimos.efectivoCaja = efectivoCaja.value;
    ultimos.cheques = chequesCartera.value;
    ultimos.cien = cien.value;
    ultimos.cincuenta = cincuenta.value;
    ultimos.veinte = veinte.value;
    ultimos.diez = diez.value;
    ultimos.monedas = monedas.value;
    ultimos.guardado = guardado.value;
    ultimos.uno = uno.value;
    ultimos.cambioCaja = cambioCaja.value;
    ultimos.ceroVeinticinco = ceroVeinticinco.value;
    ultimos.ceroCincuenta = ceroCincuenta.value;
    ultimos.maleta = maleta.value;
    await axios.put(`${URL}ultimos`,ultimos);
});

const ponerValores = (obj) =>{
    efectivoCaja.value = obj.efectivoCaja.toFixed(2)
    chequesCartera.value = obj.cheques.toFixed(2);
    cien.value = obj.cien.toFixed(2);
    cincuenta.value = obj.cincuenta.toFixed(2);
    veinte.value = obj.veinte.toFixed(2);
    diez.value = obj.diez.toFixed(2);
    monedas.value = obj.monedas.toFixed(2);
    guardado.value = obj.guardado.toFixed(2);
    uno.value = obj.uno.toFixed(2);
    cambioCaja.value = obj.cambioCaja.toFixed(2);
    ceroVeinticinco.value = obj.ceroVeinticinco.toFixed(2);
    ceroCincuenta.value = obj.ceroCincuenta.toFixed(2);
    maleta.value = obj.maleta.toFixed(2);
};

const selected = (e)=>{
    e.select()
}

efectivoCaja.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        chequesCartera.focus();
    };
});

chequesCartera.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cien.focus();
    };
});

cien.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cincuenta.focus();
    };
});


cincuenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        veinte.focus();
    };
});

veinte.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        diez.focus();
    };
});

diez.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        monedas.focus();
    };
});

monedas.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        guardado.focus();
    };
});

guardado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       uno.focus();
    };
});

uno.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       cambioCaja.focus();
    };
});

cambioCaja.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       ceroVeinticinco.focus();
    };
});

ceroVeinticinco.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       ceroCincuenta.focus();
    };
});

ceroCincuenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       maleta.focus();
    };
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
})