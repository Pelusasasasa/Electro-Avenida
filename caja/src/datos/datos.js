const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { configAxios } = require('../assets/js/globales');

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const tipo = document.querySelector('#tipo');
const proximo = document.querySelector('.proximo');
const agregar = document.querySelector('.agregar');
const guardar = document.querySelector('.guardar');
const salir = document.querySelector('.salir');


let cuentas = [];

const listar = (cuenta)=>{
    codigo.value =cuenta.cod;
    descripcion.value =cuenta.desc;
    tipo.value =cuenta.tipo;
}

window.addEventListener('load',async e=>{
    cuentas = (await axios.get(`${URL}cuentas`,configAxios)).data;
    listar(cuentas[0]);
});


agregar.addEventListener('click',e=>{
    agregar.classList.add('none');
    guardar.classList.remove('none');
    codigo.value = "";
    descripcion.value = "";
    tipo.value = "";

    codigo.removeAttribute('disabled');
    descripcion.removeAttribute('disabled');
    tipo.removeAttribute('disabled');

    codigo.focus();
});

codigo.addEventListener('keypress',async e=>{
    if ((e.key === "Enter")) {
        const cuentaExistente = cuentas.find(cuenta => cuenta.cod === codigo.value.toUpperCase());
        if (cuentaExistente) {
            await sweet.fire({
                title:"CODIGO YA UTILIZADO"
            });
            codigo.value = "";
        }else{
            descripcion.focus();
        }
    }
});

descripcion.addEventListener('keypress',e=>{
    if ((e.key === "Enter")) {
        tipo.focus();
    }
});

tipo.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        agregar.classList.contains('none') ? guardar.focus() : agregar.focus(); 
    }
});

codigo.addEventListener('focus',e=>{
    codigo.select();
});

descripcion.addEventListener('focus',e=>{
    descripcion.select();
});

tipo.addEventListener('focus',e=>{
    tipo.select();
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});

guardar.addEventListener('click',async e=>{
    const cuenta = {};
    cuenta.cod = (codigo.value).toUpperCase();
    cuenta.desc = (descripcion.value).toUpperCase();
    cuenta.tipo = tipo.value.toUpperCase();
    try {
        await axios.post(`${URL}cuentas`,cuenta,configAxios);
        location.reload();
    } catch (error) {
        sweet.fire({
            title:"No se pudo cargar la cuenta"
        })
    }
})

proximo.addEventListener('click',e=>{
    const index = cuentas.findIndex(cuenta => cuenta.cod === codigo.value);
    if (cuentas[index+1] !== undefined) {
        listar(cuentas[index+1]);
    }
});
