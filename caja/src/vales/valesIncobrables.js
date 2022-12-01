const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { redondear, copiar } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');

const total = document.getElementById('total');

const agregar = document.querySelector('.agregar');
const sumar = document.querySelector('.sumar');
const salir = document.querySelector('.salir');

let vales;
let seleccionado;
let subSeleccionado;
let totalInput = 0;

window.addEventListener('load',async e=>{
    copiar();
    vales = (await axios.get(`${URL}vales/incobrable`)).data
    listarVales(vales)
});

const listarVales = (lista)=>{
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdFecha = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdRSocial = document.createElement('td');
        const tdConcepto = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdAcciones = document.createElement('td');

        const fecha = elem.fecha.slice(0,10).split('-',3);

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdNumero.innerHTML = elem.nro_comp;
        tdRSocial.innerHTML = elem.rsoc;
        tdConcepto.innerHTML = elem.concepto;
        tdImporte.innerHTML = redondear(elem.imp,2);

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

        tdAcciones.classList.add('acciones')

        tr.appendChild(tdFecha);
        tr.appendChild(tdNumero);
        tr.appendChild(tdRSocial);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImporte);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);

        totalInput += elem.imp;
    }
    total.value = redondear(totalInput,2);
}

tbody.addEventListener('click',async e=>{
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
        await sweet.fire({
            title: "Quiere Eliminar",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if(isConfirmed){
                try {
                    await axios.delete(`${URL}vales/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                    total.value = redondear(parseFloat(total.value) - parseFloat(seleccionado.children[4].innerHTML),2);
                } catch (erro) {
                    await sweet.fire({
                        title:"No se pudo borrar el vale"
                    })
                }
            }
        })
    }else if(e.target.innerHTML === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path:'vales/agregar-modificarIncobrables.html',
            width:500,
            height:500,
            reinicio:true,
            informacion:seleccionado.id
        });
    }

});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'vales/agregar-modificarIncobrables.html',
        width:500,
        height:500,
        reinicio:true
    })
});

sumar.addEventListener('click',async e=>{
    if (seleccionado) {
        let suma = 0;
        for(let vale of vales){
            if (vale.rsoc === seleccionado.children[2].innerHTML) {
                suma += vale.imp;
            }
        }
        await sweet.fire(`La suma de ${seleccionado.children[2].innerHTML} es: $${redondear(suma,2)}`);
    }else{
        await sweet.fire({
            title:"Seleccionar un vale"
        })
    }
})

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html';
    }
})

salir.addEventListener('click',e=>{
    location.href = '../index.html';
})