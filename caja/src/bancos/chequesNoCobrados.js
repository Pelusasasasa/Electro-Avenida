
const axios = require('axios');
const { cerrarVentana } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const tbody = document.querySelector('tbody');



window.addEventListener('load',async e=>{
    cerrarVentana();
    const chequesNoCobrados = (await axios.get(`${URL}cheques/sinFechaPagoYPropios`)).data;
    listarCheques(chequesNoCobrados);
});

listarCheques = (lista)=>{
    lista.sort((a,b)=>{
        if (a.f_cheque > b.f_cheque) {
            return 1
        }else if(a.f_cheque < b.f_cheque){
            return -1
        }
        return 0
    })
    let total = 0;
    lista.forEach(cheque => {
        const fechaRecibido = cheque.f_recibido.slice(0,10).split('-',3);
        const fechaCheque = cheque.f_cheque.slice(0,10).split('-',3);
        const tr = document.createElement('tr');

        const tdEmision = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdFechaCheque = document.createElement('td');
        const tdEntregadoA = document.createElement('td');
        const tdImporte = document.createElement('td');

        tdEmision.innerHTML = `${fechaRecibido[2]}/${fechaRecibido[1]}/${fechaRecibido[0]}`;
        tdNumero.innerHTML = cheque.n_cheque;
        tdFechaCheque.innerHTML = `${fechaCheque[2]}/${fechaCheque[1]}/${fechaCheque[0]}`;
        tdEntregadoA.innerHTML = cheque.entreg_a;
        tdImporte.innerHTML = cheque.i_cheque.toFixed(2);

        tdImporte.classList.add('text-right');

        tr.appendChild(tdEmision);
        tr.appendChild(tdNumero);
        tr.appendChild(tdFechaCheque);
        tr.appendChild(tdEntregadoA);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);

        total += cheque.i_cheque;
    });

    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const tdTotal = document.createElement('td');

    td4.innerHTML = "Total:";
    tdTotal.innerHTML = total.toFixed(2);

    tr.classList.add('bold');
    tr.classList.add('text-right');

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(tdTotal);
    tbody.appendChild(tr);
    
}