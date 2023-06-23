const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const { ipcRenderer } = require('electron');
const { copiar, redondear, configAxios } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');

const buscador = document.getElementById('buscador');
const totalInput = document.getElementById('total');

const agregar = document.querySelector('.agregar');
const sumar = document.querySelector('.sumar');
const imprimir = document.querySelector('.imprimir');
const salir = document.querySelector('.salir');

let seleccionado;
let subSeleccionado;

let total = 0;
let vales;
 
window.addEventListener('load',async e=>{
    copiar();
    vales = (await axios.get(`${URL}vales/cliente`,configAxios)).data;
    listarVales(vales);
});

buscador.addEventListener('keyup',e=>{
    console.log(vales)
    const valesFiltrados = vales.filter(vale => (vale.rsoc).startsWith(buscador.value.toUpperCase()));
    listarVales(valesFiltrados);
});

//Listamos los vales en el tbody
const listarVales = (lista)=>{
    total = 0;
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
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('acciones')

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdNro_comp.innerHTML = elem.nro_comp;
        tdRsoc.innerHTML = elem.rsoc;
        tdTipoComp.innerHTML = "";
        tdConcepto.innerHTML = elem.concepto;
        tdImp.innerHTML = elem.imp.toFixed(2);
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

        tr.appendChild(tdFecha);
        tr.appendChild(tdNro_comp);
        tr.appendChild(tdRsoc);
        tr.appendChild(tdTipoComp);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImp);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }
    totalInput.value = total.toFixed(2);
}

//cuando hacemos click en la tabla seleccionamos el tr
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
        subSeleccionado = e.target.parentNode.parentNode.parentNode;
    }

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');


    if (e.target.innerHTML === "delete") {
        sweet.fire({
            title:"Quiere Eliminar?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}vales/id/${seleccionado.id}`,configAxios);
                    tbody.removeChild(seleccionado);
                    totalInput.value = redondear(parseFloat(totalInput.value) - parseFloat(seleccionado.children[5].innerHTML),2);
                } catch (error) {
                    sweet.fire({
                        title:"No se pudo eliminar el vale"
                    })
                }
            }
        });
    }else if(e.target.innerHTML === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path: './vales/agregar-modificarVales.html',
            width:500,
            height:400,
            reinicio:true,
            informacion:seleccionado.id
        });
    }

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

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html';
    }
});

//salimos de la ventana
salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

