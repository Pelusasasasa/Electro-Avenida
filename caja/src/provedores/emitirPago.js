const {redondear} = require('../assets/js/globales');

const sweet = require('sweetalert2');

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
const tbodyCheque = document.getElementById('tbodyCheque');


//totales
const total = document.getElementById('total');
const totalCheque = document.getElementById('totalCheque');

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

    const button = document.createElement('button');
    button.innerText = "Eliminar";

    const tdNumero = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdDescuento = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdEliminar = document.createElement('td');

    tdNumero.innerHTML = puntoVenta.value.padStart(4,'0') + '-' + numero.value.padStart(8,'0');
    tdTipo.innerHTML = tipo.value;
    tdDescuento.innerHTML = "0.00";
    tdImporte.innerHTML = importe.value;
    tdEliminar.appendChild(button);

    tr.appendChild(tdNumero);
    tr.appendChild(tdTipo);
    tr.appendChild(tdDescuento);
    tr.appendChild(tdImporte);
    tr.appendChild(tdEliminar);

    tbodyComprobante.appendChild(tr);

    total.value = redondear(parseFloat(importe.value) + parseFloat(total.value),2);
}

//cheques
numeroCheque.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        const cheque = (await axios.get(`${URL}cheques/numero/${numeroCheque.value}`)).data;
        if (cheque && !cheque.entreg_a) {
            const fechaCheque = cheque.f_cheque.slice(0,10).split('-',3);
            banco.value = cheque.banco;
            fecha.value = `${fechaCheque[0]}-${fechaCheque[1]}-${fechaCheque[2]}`;
            importeCheque.value = redondear(cheque.i_cheque,2);
        }else if(cheque && cheque.entreg_a){
            await sweet.fire({
                title:`Cheque Entregado a ${cheque.entreg_a}`
            })
        }
        banco.focus();
    }
});

banco.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fecha.focus();
    }
});

fecha.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        importeCheque.focus();
    }
});

importeCheque.addEventListener('keypress',e=>{
   if (e.keyCode === 13) {
    agregarCheque();
   }
});

const agregarCheque = ()=>{
    const tr = document.createElement('tr');

    const button = document.createElement('button');
    button.innerHTML = "Eliminar";

    const tdNumero = document.createElement('td');
    const tdBanco = document.createElement('td');
    const tdImporteCheque = document.createElement('td');
    const tdEliminar = document.createElement('td');

    tdNumero.innerHTML = numeroCheque.value;
    tdBanco.innerHTML = banco.value;
    tdImporteCheque.innerHTML = importeCheque.value;
    tdEliminar.appendChild(button)

    tr.appendChild(tdNumero);
    tr.appendChild(tdBanco);
    tr.appendChild(tdImporteCheque);
    tr.appendChild(tdEliminar);

    tbodyCheque.appendChild(tr);
    totalCheque.value = redondear(parseFloat(totalCheque.value) + parseFloat(importeCheque.value),2);

    numeroCheque.value = "";
    banco.value = "";
    fecha.value = "";
    importeCheque.value = "";

    numeroCheque.focus();
};
