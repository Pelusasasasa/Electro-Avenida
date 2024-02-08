const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { copiar, configAxios } = require("../funciones");

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const nombreSubRubro = document.querySelector('#nombreSubRubro');

const agregarSubRubro = document.querySelector('.agregarSubRubro');

const tbody = document.querySelector('tbody');
const tbodySubRubro = document.querySelector('.tbodySubRubro');

const guardar = document.querySelector('.guardar');
const agregar = document.querySelector('#agregar');
const limpiar = document.querySelector('#limpiar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

let rubros = [];
let seleccionado;
let subSeleccionado;

const listar = async(lista)=>{
    for await(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdCodigo = document.createElement('td');
        const tdNombre = document.createElement('td');

        tdCodigo.innerHTML = elem.codigo.toString().padStart(4,'0');
        tdNombre.innerHTML = elem.nombre;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdNombre);
        
        tbody.appendChild(tr);
    }
};

const agregarASubRubro = async() => {
    const tr = document.createElement('tr');

    const tdCodigo = document.createElement('td');
    const tdNombre = document.createElement('td');

    tdCodigo.innerText = 1;
    tdNombre.innerText = nombreSubRubro.value.toUpperCase();

    tr.appendChild(tdCodigo);
    tr.appendChild(tdNombre);

    tbodySubRubro.appendChild(tr);

    nombreSubRubro.value = "";
    agregarSubRubro.classList.add('none')
};


guardar.addEventListener('click',async e=>{
    const rubro = {};
    rubro.codigo = codigo.value;
    rubro.nombre = nombre.value.toUpperCase();

    try {
        await axios.post(`${URL}rubros`,rubro,configAxios);
        location.reload();
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se pudo cargar el rubro"
        });
    }
});

window.addEventListener('load',async e=>{
    copiar();
    const id = (await axios.get(`${URL}rubros/codigo`,configAxios)).data;
    rubros = (await axios.get(`${URL}rubros`,configAxios)).data;
    listar(rubros)
    codigo.value = (id.toString().padStart(4,'0'));
});

agregar.addEventListener('click',async e=>{
    agregarASubRubro();
});

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');

    seleccionado && agregarSubRubro.classList.remove('none')
});

tbody.addEventListener('dblclick',e=>{
    const rubro = rubros.find(rubro =>rubro._id === e.target.parentNode.id);
    console.log(rubro)
    sweet.fire({
        title:"Eliminar",
        confirmButtonText: "Eliminar",
        showCancelButton:true
    }).then(async ({isConfirmed})=>{
        if (isConfirmed) {
            await sweet.fire({
                title:`Seguro que quire eliminar ${rubro.nombre}?`,
                confirmButtonText:"Aceptar",
                showCancelButton:true
            }).then(async({isConfirmed:confirmado})=>{
                if (confirmado) {
                    try {
                        await axios.delete(`${URL}rubros/${rubro._id}`,configAxios);
                        location.reload();
                    } catch (error) {
                        console.log(error);
                        await sweet.fire({
                            title:"No se pudo eliminar el rubro"
                        })
                    }
                }
            })
        }
    })
});

limpiar.addEventListener('click', () => {
    nombreSubRubro.value = '';
});

codigo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        nombre.focus();
    }
});

nombre.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        guardar.focus();
    }
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});

codigo.addEventListener('focus',e=>{
    codigo.select();
});

nombre.addEventListener('focus',e=>{
    nombre.select();
});