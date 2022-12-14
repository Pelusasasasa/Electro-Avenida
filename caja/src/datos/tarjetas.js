const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

const tarjetas = document.getElementById('tarjetas');
const nuevo = document.getElementById('nuevo');
const agregar = document.getElementById('agregar');
const nombre = document.getElementById('nombre');
const botonAgregar = document.getElementById('botonAgregar');
const buttonAgregar = document.getElementById('buttonAgregar');

window.addEventListener('load',async e=>{
    const tarjetas  = (await axios.get(`${URL}tipoTarjetas`)).data;
    listarTarjetas(tarjetas)
});

const listarTarjetas = async(lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.nombre;
        option.text = elem.nombre;
        tarjetas.appendChild(option)
    }
}

nuevo.addEventListener('click',e=>{
    agregar.classList.remove('none');
    botonAgregar.classList.remove('none');
    nombre.focus();
});

nombre.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        buttonAgregar.focus();
        
    }
});

buttonAgregar.addEventListener('click',async e=>{
    const tarjeta = {};
    tarjeta.nombre = nombre.value.toUpperCase();

    try {
        await axios.post(`${URL}tipoTarjetas`,tarjeta);
        location.reload();
    } catch (error) {
        sweet.fire({
            title:"No se puede cargar esta tarjeta"
        });
    }
});