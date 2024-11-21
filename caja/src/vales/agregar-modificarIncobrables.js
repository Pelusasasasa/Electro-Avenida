const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

let vale;

const sweet = require('sweetalert2');
const { cerrarVentana } = require('../assets/js/globales');

const fecha = document.getElementById('fecha');
const nro_comp = document.getElementById('nro_comp');
const rSocial = document.getElementById('rSocial');
const concepto = document.getElementById('concepto');
const imp = document.getElementById('imp');

const aceptar = document.querySelector('.aceptar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

window.addEventListener('load',e=>{
    cerrarVentana();

    const date = new Date();
    
    let day = date.getDate();
    let month = date.getMonth() +1;
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month === 13 ? 1 : month;
    month = month < 10 ? `0${month}` : month;
    fecha.value = `${year}-${month}-${day}`;
});

console.log(salir)
aceptar.addEventListener('click',async e=>{
    const vale = {};
    vale.fecha = fecha.value;
    vale.nro_comp = nro_comp.value;
    vale.rsoc = rSocial.value.toUpperCase();
    vale.concepto = concepto.value.toUpperCase();
    vale.imp = imp.value;
    vale.tipo = "I";
     
    try {
        await axios.post(`${URL}vales`,vale,configAxios);
        window.close();
    } catch (error) {
        await sweet.fire({
            title:"No se pudo cargar el vale"
        })
    }
});

modificar.addEventListener('click',async e=>{
    const vale = {};
    vale.fecha = fecha.value;
    vale.nro_comp = nro_comp.value.toUpperCase();
    vale.rsoc = rSocial.value.toUpperCase();
    vale.imp = imp.value;

    try {
        await axios.put(`${URL}vales/id/${modificar.id}`,configAxios);
        window.close();
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar el vale"
        })
    }
});

salir.addEventListener('click',e=>{
    window.close();
});

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    vale = (await axios.get(`${URL}vales/id/${args}`,configAxios)).data;
    modificar.classList.remove('none');
    modificar.id = args;
    aceptar.classList.add('none');
    fecha.disabled = false;
    listarVale(vale);
});

const listarVale = (vale)=>{
    const date = vale.fecha.slice(0,10).split('-',3);
    console.log(date)
    fecha.value = `${date[0]}-${date[1]}-${date[2]}`;
    nro_comp.value = vale.nro_comp;
    rSocial.value = vale.rsoc;
    concepto.value = vale.concepto;
    imp.value = vale.imp;
}

nro_comp.addEventListener('keyup',e=>{
    console.log(e.keyCode)
    if (e.keyCode === 13) {
        rSocial.focus();
    }else if(e.key !== "-" && nro_comp.value.length === 4 && e.keyCode === 8){
        nro_comp.value = nro_comp.value + "-";
    }
});

rSocial.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        concepto.focus();
    }
});

concepto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        imp.focus();
    }
});

imp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (aceptar.classList.contains('none')) {
            modificar.focus();
        }else{
            aceptar.focus();
        }
    }
});

nro_comp.addEventListener('focus',e=>{
    nro_comp.focus();
});

rSocial.addEventListener('focus',e=>{
    rSocial.focus();
});

concepto.addEventListener('focus',e=>{
    concepto.focus();
});

imp.addEventListener('focus',e=>{
    imp.focus();
});