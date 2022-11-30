const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const { copiar } = require('../assets/js/globales');
const { ipcRenderer } = require('electron/renderer');

const buscador = document.getElementById('buscador');
const inputTotal = document.getElementById('total');
const tbody = document.querySelector('tbody');

const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const sumar = document.querySelector('.sumar');
const salir = document.querySelector('.salir');


//variables
let total = 0;
let seleccionado;
let subSeleccionado;
let facturas;

window.addEventListener('load',async e=>{
    copiar();
    facturas = (await axios.get(`${URL}vales/factura`)).data;
    listarFacturas(facturas);
});

buscador.addEventListener('keyup',e=>{
    const facturasFiltrados = facturas.filter(factura=>factura.rSoc.startsWith(buscador.value.toUpperCase()));
    listarFacturas(facturasFiltrados);
});

const listarFacturas = async(lista)=>{

    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const date = elem.fecha.slice(0,10).split('-',3);

        const tdSocial = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdNroComprobante = document.createElement('td');
        const tdConcepto = document.createElement('td');
        const tdImporte = document.createElement('td');
    
        tdSocial.innerHTML = elem.rsoc;
        tdFecha.innerHTML = `${date[2]}/${date[1]}/${date[0]}`;
        tdNroComprobante.innerHTML = elem.nro_comp;
        tdConcepto.innerHTML = elem.concepto;
        tdImporte.innerHTML = elem.imp.toFixed(2);

        tdImporte.classList.add('text-right');

        tr.appendChild(tdSocial);
        tr.appendChild(tdFecha);
        tr.appendChild(tdNroComprobante);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);
        total += elem.imp;
    }
    inputTotal.value = total.toFixed(2);
};

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'vales/agregar-modificarFacturas.html',
        width: 500,
        height: 400,
        reinicio:true
    })
});

modificar.addEventListener('click',e=>{
    if (seleccionado) {
        ipcRenderer.send('abrir-ventana',{
            path:'vales/agregar-modificarFacturas.html',
            width: 500,
            height: 400,
            reinicio:true,
            informacion:seleccionado.id
        })
    }else{
        sweet.fire({
            title:"Ninguna factura seleccionado"
        })
    }
});

sumar.addEventListener('click',async e=>{
    if (seleccionado) {
        const rSocial = seleccionado.children[0].innerHTML;
        let totalSumar = 0;
        for(let factura of facturas){
            if (factura.rSoc === rSocial) {
                totalSumar += factura.imp;
            }
        }
        await sweet.fire({
            title :`Total ${rSocial}: $${totalSumar.toFixed(2)}`
        });
    }else{
        await sweet.fire({
            title:"Seleccionar una Razon social"
        })
    }
    
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});