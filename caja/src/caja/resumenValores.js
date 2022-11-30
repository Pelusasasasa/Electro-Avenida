const { ipcRenderer } = require("electron");

const axios = require('axios');
const { redondear } = require("../assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;

const efectivoCaja = document.querySelector('#efectivoCaja');
const cheques = document.querySelector('#cheques');
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

const valesCobrar = document.getElementById('valesCobrar');
const personal = document.getElementById('personal');
const incobrable = document.getElementById('incobrable');
const tarjetasCobrar = document.getElementById('tarjetasCobrar');
const totalVales = document.getElementById('totalVales');

const chequesEfectivo = document.getElementById('chequesEfectivo');
const valesEfectivo = document.getElementById('valesEfectivo');

const caja1 = document.getElementById('caja1');
const diferencia = document.getElementById('diferencia');

let desde;
let hasta;

let ultimos = {};

window.addEventListener('load',async e=>{
    valesCobrar .value = (await axios.get(`${URL}vales/totalPrice/C`)).data.toFixed(2);
    personal.value = (await axios.get(`${URL}vales/totalPrice/P`)).data.toFixed(2);
    incobrable.value = (await axios.get(`${URL}vales/totalPrice/I`)).data.toFixed(2);
    tarjetasCobrar.value = (await axios.get(`${URL}tarjetas/totalPrice`)).data.toFixed(2);

    totalVales.value = parseFloat(valesCobrar.value) + parseFloat(personal.value) + parseFloat(incobrable.value) + parseFloat(tarjetasCobrar.value);
    ultimos = (await axios.get(`${URL}ultimos`)).data;

    ponerValores(ultimos);

    
    //traemos el total el movimiento de caja
});

window.addEventListener('beforeunload',async e=>{
    ultimos.efectivoCaja = efectivoCaja.value;
    ultimos.cheques = cheques.value;
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
    if (obj) {
        let totalValesCheques = 0;
        efectivoCaja.value = obj.efectivoCaja.toFixed(2)
        cheques.value = obj.cheques.toFixed(2);
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

        totalValesCheques+= (obj.efectivoCaja + obj.cheques + obj.cien + obj.cincuenta + obj.veinte + obj.diez + obj.monedas + obj.guardado + obj.uno + obj.cambioCaja + obj.ceroCincuenta + obj.ceroCincuenta + obj.maleta);
        chequesEfectivo.value = redondear(totalValesCheques,2);

        valesEfectivo.value = parseFloat(chequesEfectivo.value) + parseFloat(totalVales.value);

        diferencia.value = redondear(parseFloat(caja1.value) - parseFloat(valesEfectivo.value),2);
    }
};

const selected = (e)=>{
    e.select()
}

efectivoCaja.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cheques.focus();
    };
});

cheques.addEventListener('keypress',e=>{
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

salir.addEventListener('click',e=>{
    window.close();
})

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    const saldo = (await axios.get(`${URL}movCajas/price/${args.desde}/${args.hasta}`)).data;
    caja1.value = saldo;
});


efectivoCaja.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cheques.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cien.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cincuenta.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

veinte.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

diez.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

monedas.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

guardado.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

uno.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cambioCaja.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

ceroVeinticinco.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

ceroCincuenta.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

maleta.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

const cambiarTotales = (input)=>{
    ultimos[input.id] = parseFloat(input.value)
    ponerValores(ultimos);
}