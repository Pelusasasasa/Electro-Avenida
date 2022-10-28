const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const { ipcRenderer } = require('electron');
const { copiar } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');

const buscador = document.getElementById('buscador');
const totalInput = document.getElementById('total');

const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const borrar = document.querySelector('.borrar');
const sumar = document.querySelector('.sumar');
const imprimir = document.querySelector('.imprimir');
const salir = document.querySelector('.salir');

let seleccionado;
let subSeleccionado;

let total = 0;
let vales;
 
window.addEventListener('load',async e=>{
    copiar();
    vales = (await axios.get(`${URL}vales/cliente`)).data;
    listarVales(vales);
});

buscador.addEventListener('keyup',e=>{
    const valesFiltrados = vales.filter(vale => (vale.rsoc).startsWith(buscador.value.toUpperCase()));
    listarVales(valesFiltrados);
});

//Listamos los vales en el tbody
const listarVales = (lista)=>{
    tbody.innerHTML = "";
    for(let elem of lista){
        total += elem.imp;

        const tr = document.createElement('tr');
        tr.id = elem._id;

        const fecha = elem.fecha.slice(0,10).split('-',3);

        const tdFecha = document.createElement('td');
        const tdNro_comp = document.createElement('td');
        const tdRsoc = document.createElement('td');
        const tdTipoComp = document.createElement('td');
        const tdConcepto = document.createElement('td');
        const tdImp = document.createElement('td');

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdNro_comp.innerHTML = elem.nro_comp;
        tdRsoc.innerHTML = elem.rsoc;
        tdTipoComp.innerHTML = "";
        tdConcepto.innerHTML = elem.concepto;
        tdImp.innerHTML = elem.imp.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdNro_comp);
        tr.appendChild(tdRsoc);
        tr.appendChild(tdTipoComp);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImp);

        tbody.appendChild(tr);
    }
    totalInput.value = total.toFixed(2);
}

//cuando hacemos click en la tabla seleccionamos el tr
tbody.addEventListener('click',e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');

});

//abrimos una ventana para agregar vales
agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path: './vales/agregar-modificarVales.html',
        width:500,
        height:400,
        reinicio:true
    });
});

//abrimos una ventana para modificar vales
modificar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path: './vales/agregar-modificarVales.html',
        width:500,
        height:400,
        reinicio:true,
        informacion:seleccionado.id
    });
});

borrar.addEventListener('click',async e=>{
    if (seleccionado) {
        await sweet.fire({
            title:"Seguro quiere borrar",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}vales/id/${seleccionado.id}`);
                    location.reload();
                } catch (error) {
                    await sweet.fire({
                        title:"No se pudo borrar el Vale"
                    })
                }
            }
        });
    }
});

//sumamos la rason social que aparezcan igual
sumar.addEventListener('click',async e=>{
    if (seleccionado) {
        let suma = 0;
        for(let vale of vales){
            if (vale.rsoc === seleccionado.children[2].innerHTML) {
                suma += vale.imp
            }
        }
        await sweet.fire({
            title:`El total de ${seleccionado.children[2].innerHTML} es: $${suma}`
        });
    }
});

//salimos de la ventana
salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

