const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const { copiar, redondear } = require('../assets/js/globales');
const { ipcRenderer } = require('electron/renderer');

const buscador = document.getElementById('buscador');
const inputTotal = document.getElementById('total');
const tbody = document.querySelector('tbody');

const agregar = document.querySelector('.agregar');
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
        const tdAcciones = document.createElement('td');
    
        tdSocial.innerHTML = elem.rsoc;
        tdFecha.innerHTML = `${date[2]}/${date[1]}/${date[0]}`;
        tdNroComprobante.innerHTML = elem.nro_comp;
        tdConcepto.innerHTML = elem.concepto;
        tdImporte.innerHTML = elem.imp.toFixed(2);
        tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div id=delete class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `
        tdAcciones.classList.add('acciones');
        tdImporte.classList.add('text-right');

        tr.appendChild(tdSocial);
        tr.appendChild(tdFecha);
        tr.appendChild(tdNroComprobante);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImporte);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
        total += elem.imp;
    }
    inputTotal.value = total.toFixed(2);
};

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    }
    
    seleccionado.classList.add('seleccionado');    
    subSeleccionado.classList.add('subSeleccionado');


    if (e.target.innerHTML === "delete") {
        sweet.fire({
            title:"Quiere Eliminar",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}vales/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                    inputTotal.value = redondear(parseFloat(inputTotal.value) - parseFloat(seleccionado.children[4].innerHTML),2)
                } catch (error) {
                    console.log(error)
                    sweet.fire({
                        title:"No se pudo borrar el Vale Factura"
                    })
                }
            }
        })
    }else if(e.target.innerHTML === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path:'vales/agregar-modificarFacturas.html',
            width: 500,
            height: 400,
            reinicio:true,
            informacion:seleccionado.id
        })
    }
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'vales/agregar-modificarFacturas.html',
        width: 500,
        height: 400,
        reinicio:true
    })
});

sumar.addEventListener('click',async e=>{
    if (seleccionado) {
        const rSocial = seleccionado.children[0].innerHTML;
        let totalSumar = 0;
        for(let factura of facturas){
            if (factura.rsoc === rSocial) {
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

document.addEventListener('keyup',e=>{
    if(e.keyCode === 27){
        location.href = `../index.html`
    }
});