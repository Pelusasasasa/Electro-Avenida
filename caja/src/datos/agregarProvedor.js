const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const provedor = document.querySelector('#provedor');
const direccion = document.querySelector('#direccion');
const codPostal = document.querySelector('#codPostal');
const localidad = document.querySelector('#localidad');
const provincia = document.querySelector('#provincia');
const telefono = document.querySelector('#telefono');
const email = document.querySelector('#email');
const condIva = document.querySelector('#condIva');
const cuit = document.querySelector('#cuit');
const viajante = document.querySelector('#viajante');
const contacto = document.querySelector('#contacto');
const condDGR = document.querySelector('#condDGR');
const nroDGR = document.querySelector('#nroDGR');
const direccionPostal = document.querySelector('#direccionPostal');
const localidadPostal = document.querySelector('#localidadPostal');
const codigoPostal = document.querySelector('#codigoPostal');
const provinciaPostal = document.querySelector('#provinciaPostal');



const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');


agregar.addEventListener('click',async e=>{
    const nuevoProvedor = {};
    nuevoProvedor.codigo = codigo.value;
    nuevoProvedor.nombre = nombre.value.toUpperCase();
    nuevoProvedor.provedor = provedor.value.toUpperCase();
    nuevoProvedor.direccion = direccion.value.toUpperCase();
    nuevoProvedor.localidad = localidad.value.toUpperCase();
    nuevoProvedor.provincia = provincia.value.toUpperCase();
    nuevoProvedor.codPostal = codPostal.value;
    nuevoProvedor.condIva = condIva.value;
    nuevoProvedor.telefono = telefono.value;
    nuevoProvedor.mail = email.value;
    nuevoProvedor.cuit = cuit.value;
    nuevoProvedor.nro_dgr = nroDGR.value;
    nuevoProvedor.dgr = condDGR.value;
    nuevoProvedor.localidadPostal = localidadPostal.value;
    nuevoProvedor.direccionPostal = direccionPostal.value;
    nuevoProvedor.codigoPostal = codigoPostal.value;
    nuevoProvedor.provinciaPostal = provinciaPostal.value;
    try {
        await axios.post(`${URL}provedor`,nuevoProvedor);
        window.close();
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se puedo cargar provedor"
        });
    }
});


window.addEventListener('load',async e=>{
    const id = (await axios.get(`${URL}provedor/traerId`)).data;
    codigo.value = id;
});

salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});


codigo.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        nombre.focus();
    }
});

nombre.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provedor.focus();
    }
});

provedor.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        direccion.focus();
    }
});

direccion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        codPostal.focus();
    }
});

codPostal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        localidad.focus();
    }
});

localidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provincia.focus();
    }
});


provincia.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        telefono.focus();
    }
});


telefono.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        email.focus();
    }
});

email.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        condIva.focus();
    }
});

condIva.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        cuit.focus();
    }
});

cuit.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        viajante.focus();
    }
});

viajante.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        contacto.focus();
    }
});

contacto.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        condDGR.focus();
    }
});

condDGR.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        nroDGR.focus();
    }
});

nroDGR.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        direccionPostal.focus();
    }
});

direccionPostal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        localidadPostal.focus();
    }
});

localidadPostal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        codigoPostal.focus();
    }
});

codigoPostal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provinciaPostal.focus();
    }
});

provinciaPostal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        agregar.focus();
    }
});

