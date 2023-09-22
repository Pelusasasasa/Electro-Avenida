const axios = require('axios');
const { redondear } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const tbodyFacturas = document.querySelector('.tbodyFacturas');
const tbodyNotaCreditos = document.querySelector('.tbodyNotaCreditos');
const tbodyCompras = document.querySelector('.tbodyCompras');

const mes = document.getElementById('mes');
const buscar = document.getElementById('buscar');

window.addEventListener('load',inicio);
buscar.addEventListener('click',busqueda);

async function getFacturas() {
    const month = mes.value.split('-')[1];
    const year = mes.value.split('-')[0];

    const ventas = (await axios.get(`${URL}ventas/forMonthAndYear/${month}/${year}`)).data;
    return ventas
};

async function getCompras(){
    const month = mes.value.split('-')[1];
    const year = mes.value.split('-')[0];

    const compras = (await axios.get(`${URL}dat_comp/forMonthAndYear/${month}/${year}`)).data;

    return compras
};

async function inicio(){
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    month = month === 13 ? 1 : month;
    month = month < 10 ?  `0${month}` : month;

    mes.value = year + '-' + month;
};

async function busqueda(){
    const tickets = await getFacturas();
    const compras = await getCompras();
    const facturas = tickets.filter(ticket => ticket.tipo_comp === 'Ticket Factura');
    const notas = tickets.filter(ticket => ticket.tipo_comp === 'Nota Credito');
    

    listarFacturas(facturas);
    listarNotas(notas);
    listarCompras(compras);
};

async function listarFacturas(facturas){

    let totalIva21 = 0;
    let totalIva105 = 0;
    let totalPrecio = 0;

    for(let i=0; i < facturas.length; i++){
        const factura = facturas[i];

        totalIva21 += factura.iva21;
        totalIva105 += factura.iva105;
        totalPrecio += factura.precioFinal;
        
        if ((new Date(factura.fecha).getDate() !== new Date(facturas[i+1].fecha).getDate())) {
            const tr = document.createElement('tr');

            const tdDia = document.createElement('td');
            const tdGravado = document.createElement('td');
            const tdIva21 = document.createElement('td');
            const tdIva105 = document.createElement('td');
            const tdTotal = document.createElement('td');
            
            const dia = new Date(factura.fecha).getDate();

            tdDia.innerText = dia < 10 ? `0${dia}` : dia;
            tdGravado.innerText = redondear(totalPrecio - totalIva21 - totalIva105,2);
            tdIva21.innerText = totalIva21.toFixed(2)
            tdIva105.innerText = totalIva105.toFixed(2);
            tdTotal.innerText = totalPrecio.toFixed(2);
            
            tr.appendChild(tdDia)
            tr.appendChild(tdGravado);
            tr.appendChild(tdIva21);
            tr.appendChild(tdIva105);
            tr.appendChild(tdTotal);
    
            tbodyFacturas.appendChild(tr);

            totalIva21 = 0;
            totalIva105 = 0;
            totalPrecio = 0;
        }


    }
};

async function listarNotas(facturas){
    let totalIva21 = 0;
    let totalIva105 = 0;
    let totalPrecio = 0;

    for(let i=0; i < facturas.length; i++){
        const factura = facturas[i];

        totalIva21 += factura.iva21;
        totalIva105 += factura.iva105;
        totalPrecio += factura.precioFinal;
        
        if ((new Date(factura.fecha).getDate() !== new Date(facturas[i+1].fecha).getDate())) {
            const tr = document.createElement('tr');

            const tdDia = document.createElement('td');
            const tdGravado = document.createElement('td');
            const tdIva21 = document.createElement('td');
            const tdIva105 = document.createElement('td');
            const tdTotal = document.createElement('td');
            
            const dia = new Date(factura.fecha).getDate();

            tdDia.innerText = dia < 10 ? `0${dia}` : dia;
            tdGravado.innerText = redondear(totalPrecio - totalIva21 - totalIva105,2);
            tdIva21.innerText = totalIva21.toFixed(2)
            tdIva105.innerText = totalIva105.toFixed(2);
            tdTotal.innerText = totalPrecio.toFixed(2);
            
            tr.appendChild(tdDia)
            tr.appendChild(tdGravado);
            tr.appendChild(tdIva21);
            tr.appendChild(tdIva105);
            tr.appendChild(tdTotal);
    
            tbodyNotaCreditos.appendChild(tr);

            totalIva21 = 0;
            totalIva105 = 0;
            totalPrecio = 0;
        }
    };
};

async function listarCompras(compras){
    console.log(compras)
}


