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

    const trs = document.querySelectorAll('.tbodySubRubro tr');

    const tr = document.createElement('tr');
    tr.id = nombreSubRubro.value.toUpperCase().trim();

    const tdCodigo = document.createElement('td');
    const tdNombre = document.createElement('td');
    const tdAcciones = document.createElement('td');

    const button = document.createElement('button');
    button.textContent = 'Eliminar';

    button.addEventListener('click', eliminarSubrubro);

    tdCodigo.innerText = trs.length + 1;
    tdNombre.innerText = nombreSubRubro.value.toUpperCase().trim();
    tdAcciones.appendChild(button);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdNombre);
    tr.appendChild(tdAcciones);

    tbodySubRubro.appendChild(tr);
};

const eliminarSubrubro = async(e) => {

    tbodySubRubro.removeChild(e.target.parentNode.parentNode);

    const rubroModificar = rubros.find(rubro => rubro._id === seleccionado.id);;
    rubroModificar.subRubros = rubroModificar.subRubros.filter(subRubro => subRubro !== e.target.parentNode.parentNode.id);
    await axios.put(`${URL}rubros/${rubroModificar._id}`,rubroModificar,configAxios);

};

const listarSubRubros = (id) => {
    const subRubros = rubros.find(rubro => rubro._id === id).subRubros;
    let index = 0;
    tbodySubRubro.innerHTML = "";
    for(let  subRubro of subRubros){
        index++;
        const tr = document.createElement('tr');
        tr.id = subRubro;

        const tdCodigo = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdAcciones = document.createElement('td');

        const buttonEliminar = document.createElement('button');
        buttonEliminar.textContent = 'Eliminar';

        buttonEliminar.addEventListener('click', eliminarSubrubro);

        tdCodigo.innerText = index;
        tdNombre.innerText = subRubro;
        tdAcciones.appendChild(buttonEliminar);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdNombre);
        tr.appendChild(tdAcciones);

        tbodySubRubro.appendChild(tr);
    }
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
    const rubroModificado = rubros.find( rubro => rubro._id === seleccionado.id);

    if (!rubroModificado.subRubros.find(elem => elem === nombreSubRubro.value.toUpperCase().trim())) {
        agregarASubRubro();
        rubroModificado.subRubros.push(nombreSubRubro.value.toUpperCase());
        await axios.put(`${URL}rubros/${rubroModificado._id}`,rubroModificado,configAxios);
    }


    nombreSubRubro.value = "";
    agregarSubRubro.classList.add('none')
});

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');

    seleccionado && agregarSubRubro.classList.remove('none');

    listarSubRubros(seleccionado.id);
});

tbody.addEventListener('dblclick',e=>{
    const rubro = rubros.find(rubro =>rubro._id === e.target.parentNode.id);
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