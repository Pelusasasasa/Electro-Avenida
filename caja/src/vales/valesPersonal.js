const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { redondear, copiar } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');
const inputTotal = document.getElementById('total');

const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const borrar = document.querySelector('.borrar');
const sumar = document.querySelector('.sumar');
const salir = document.querySelector('.salir');

let vales = [];
let total = 0;
let seleccionado;
let subSeleccionado;

window.addEventListener('load',async e=>{
    copiar();
    vales = (await axios.get(`${URL}vales/personal`)).data;
    listarVales(vales);
});

const listarVales = (vales)=>{
    for(let vale of vales){
    const tr = document.createElement('tr');
    tr.id = vale._id;

    const fecha = vale.fecha.slice(0,10).split('-',3);

    const tdFecha = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdSocial = document.createElement('td');
    const tdConcepto = document.createElement('td');
    const tdImporte = document.createElement('td');
    
    tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`
    tdNumero.innerHTML = vale.nro_comp;
    tdSocial.innerHTML = vale.rsoc;
    tdConcepto.innerHTML = vale.concepto;
    tdImporte.innerHTML = redondear(vale.imp,2);

    tdImporte.classList.add('text-right');

    tr.appendChild(tdFecha);
    tr.appendChild(tdNumero);
    tr.appendChild(tdSocial);
    tr.appendChild(tdConcepto);
    tr.appendChild(tdImporte);

    tbody.appendChild(tr);

    total += vale.imp;
    }
    inputTotal.value = redondear(total,2);
};

tbody.addEventListener('click',e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'vales/agregar-modificarValesPersonal.html',
        width:500,
        height:500,
        reinicio:true
    })
});

modificar.addEventListener('click',async e=>{
    if (seleccionado) {
        ipcRenderer.send('abrir-ventana',{
            path:'vales/agregar-modificarValesPersonal.html',
            width:500,
            height:500,
            reinicio:true,
            informacion:seleccionado.id
        })
    }else{
        await sweet.fire({title:"Seleccionar un vale"});
    }
});

borrar.addEventListener('click',async e=>{
    if (seleccionado) {
        try {
            await axios.delete(`${URL}vales/id/${seleccionado.id}`);
            location.reload();
        } catch (error) {
            await sweet.fire({
                title:"No se pudo borrar el vale"
            })
        }
    }
});

sumar.addEventListener('click',async e=>{
    let suma = 0;
    for(let vale of vales){
        if (vale.rsoc === seleccionado.children[2].innerHTML) {
            suma += vale.imp
        }
    }
    await sweet.fire({
        title:`La suma de ${seleccionado.children[2].innerHTML} es: $${redondear(suma,2)}`
    })
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keydown', e=>{
    if (e.keyCode ===27) {
        location.href = '../index.html';
    }
})