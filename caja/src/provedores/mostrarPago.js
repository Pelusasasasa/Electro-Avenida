require('dotenv').config();
const URL = process.env.URL;
const axios = require('axios');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const tbody = document.querySelector('tbody');
const salir = document.getElementById('salir');
const volver = document.getElementById('volver');

const mostrarComprobantes = (lista) => {

    for(let {_id,fecha,rSocial,n_cheque,imp_cheque,tipo_comp,imp_Fact,n_opago} of lista){

        const tr = document.createElement('tr');
        tr.id = _id;

        const tdFecha = document.createElement('td');
        const tdProvedor = document.createElement('td');
        const tdNumeroCheque = document.createElement('td');
        const tdImpCheque = document.createElement('td');
        const tdTipo_comp = document.createElement('td');
        const tdImpFact = document.createElement('td');
        const tdN_opago  = document.createElement('td');

        tdFecha.innerText = fecha.slice(0,10).split('-',3).reverse().join('/');
        tdProvedor.innerText = rSocial;
        tdNumeroCheque.innerText = n_cheque;
        tdImpCheque.innerText = imp_cheque.toFixed(2);
        tdTipo_comp.innerText = tipo_comp;
        tdImpFact.innerText = imp_Fact.toFixed(2);
        tdN_opago.innerText = n_opago;


        tr.appendChild(tdFecha);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdNumeroCheque);
        tr.appendChild(tdImpCheque);
        tr.appendChild(tdTipo_comp);
        tr.appendChild(tdImpFact);
        tr.appendChild(tdN_opago);

        tbody.appendChild(tr);

    };

};

window.addEventListener('load', async e => {
    const numero = getParameterByName('numero');
    const comprobantes = (await axios.get(`${URL}compPagos/forNumber/${numero}`)).data;
    mostrarComprobantes(comprobantes);
});

salir.addEventListener('click', e =>{
    window.close();
});

volver.addEventListener('click', e => {
    const codProv = getParameterByName('codProv');
    location.href = `./cuentaCorriente.html?codProv=${codProv}`;
});