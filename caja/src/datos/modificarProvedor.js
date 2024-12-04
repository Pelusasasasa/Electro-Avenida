const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;
const { ipcRenderer } = require("electron");

const sweet = require('sweetalert2');
const { configAxios } = require('../assets/js/globales');

const codigo = document.querySelector('#codigo');
const inputProvedor = document.querySelector('#provedor');
const saldo = document.querySelector('#saldo');
const localidad = document.querySelector('#localidad');
const direccion = document.querySelector('#direccion');
const codPostal = document.querySelector('#codPostal');
const provincia = document.querySelector('#provincia');
const email = document.querySelector('#email');
const condIva = document.querySelector('#condIva');
const cuit = document.querySelector('#cuit');
const condDGR = document.querySelector('#condDGR');
const nroDGR = document.querySelector('#nroDGR');
const direccionPostal = document.querySelector('#direccionPostal');
const localidadPostal = document.querySelector('#localidadPostal');
const codigoPostal = document.querySelector('#codigoPostal');
const provinciaPostal = document.querySelector('#provinciaPostal');
const observaciones = document.querySelector('#observaciones');

const modificar = document.querySelector('.modificar');
const consultar = document.querySelector('.consultar');
const salir = document.querySelector('.salir');

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    const provedor = (await axios.get(`${URL}provedor/codigo/${args}`,configAxios)).data;
    console.log(provedor)
    llenarinputs(provedor);
});

const llenarinputs = async(provedor)=>{
    console.log(provedor)
    codigo.value = provedor.codigo;
    inputProvedor.value = provedor.provedor;
    saldo.value = provedor.saldo.toFixed(2);
    localidad.value = provedor.localidad;
    direccion.value = provedor.direccion;
    codPostal.value = provedor.codPostal;
    provincia.value = provedor.provincia;
    telefono.value = provedor.telefono;
    email.value = provedor.mail;
    cuit.value = provedor.cuit;
    condIva.value = provedor.situa;
    condDGR.value = provedor.dgr;
    nroDGR.value = provedor.nro_dgr ? provedor.nro_dgr : "";
    observaciones.value = provedor.observaciones;
    codigoPostal.value = provedor.codigoPostal;
    localidadPostal.value = provedor.localidadPostal;
    provinciaPostal.value = provedor.provinciaPosta;
    direccionPostal.value = provedor.direccionPostal
};


salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.key==="Escape") {
        window.close();
    }
});

consultar.addEventListener('click',e=>{
    consultar.classList.add('none');
    modificar.classList.remove('none');

    const inputs = document.querySelectorAll('input:not(#codigo)')
    const selects = document.querySelectorAll('select');
    for(let input of inputs){
        input.removeAttribute('disabled');
    };
    for(let select of selects){
        select.removeAttribute('disabled')
    };
});

modificar.addEventListener('click',async e=>{
    const provedorModificado = {};
    provedorModificado.codigo = codigo.value;
    provedorModificado.provedor = inputProvedor.value;
    provedorModificado.direccion = direccion.value;
    provedorModificado.saldo = saldo.value;
    provedorModificado.localidad = localidad.value;
    provedorModificado.saldo = saldo.value;
    provedorModificado.codPostal = codPostal.value;
    provedorModificado.telefono = telefono.value;
    provedorModificado.mail = email.value;
    provedorModificado.condIva = condIva.value;
    provedorModificado.cuit = cuit.value;
    provedorModificado.dgr = condDGR.value;
    provedorModificado.nro_dgr = nroDGR.value;
    provedorModificado.observaciones = observaciones.value;
    provedorModificado.direccionPostal = direccionPostal.value;
    provedorModificado.localidadPostal = localidadPostal.value;
    provedorModificado.codigoPostal = codigoPostal.value;
    provedorModificado.provinciaPostal = provinciaPostal.value;

    try {
        await axios.put(`${URL}provedor/codigo/${provedorModificado.codigo}`,provedorModificado,configAxios);
        await sweet.fire({
            title:`Provedor ${provedorModificado.provedor} Modificado`
        });
        window.close();
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar el provedor"
        });
    }
});

saldo.addEventListener('focus',e=>{
    saldo.select();
});
