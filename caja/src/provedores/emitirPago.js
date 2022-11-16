const {redondear} = require('../assets/js/globales')

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

//Provedor
const provedores = document.getElementById('provedores');
const saldo = document.getElementById('saldo');
const condIva = document.getElementById('condIva');
const cuit = document.getElementById('cuit');

//comprobante
const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const tipo = document.getElementById('tipo');
const importe = document.getElementById('importe');

//cheques
const numeroCheque = document.getElementById('numeroCheque');
const banco = document.getElementById('banco');
const fecha = document.getElementById('fecha');
const importeCheque = document.getElementById('importeCheque');

const tbodyComprobante = document.getElementById('tbodyComprobante');


//totales
const total = document.getElementById('total');

let totalComprobante = 0;

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


//INPUTS Y SELECT DE COMPROBANTES
puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus();
    }
});

numero.addEventListener('keypress',async e=>{
    const punto = puntoVenta.value.padStart(4,'0');
    const num = numero.value.padStart(8,'0');
    if (e.keyCode === 13) {
        const datoCompras = (await axios.get(`${URL}dat_comp/nro_Comp/${punto + '-' + num}`)).data;
        if (datoCompras) {
            const {nro_comp,total} = datoCompras;
            importe.value = total;
        }
        tipo.focus();

    }
});

tipo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        importe.focus();
    }
});

importe.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        await agregarComprobante();
        importe.value = "0.00"
        puntoVenta.value = "0000";
        numero.value = "00000000";
    }
});

puntoVenta.addEventListener('focus',e=>{
    puntoVenta.select();
});

numero.addEventListener('focus',e=>{
    numero.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});

const agregarComprobante = ()=>{
    const tr = document.createElement('tr');

    const tdNumero = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdImporte = document.createElement('td');

    tdNumero.innerHTML = puntoVenta.value.padStart(4,'0') + '-' + numero.value.padStart(8,'0');
    tdTipo.innerHTML = tipo.value;
    tdImporte.innerHTML = importe.value;

    tr.appendChild(tdNumero);
    tr.appendChild(tdTipo);
    tr.appendChild(tdImporte);

    tbodyComprobante.appendChild(tr);

    total.value = redondear(parseFloat(importe.value) + parseFloat(total.value),2);
}



//cheques
numeroCheque.addEventListener('keypress',async e=>{
    if (e.keycode === 13) {

        const cheque = await axios.get(`${URL}cheques`)

        banco.focus();
    }
});
