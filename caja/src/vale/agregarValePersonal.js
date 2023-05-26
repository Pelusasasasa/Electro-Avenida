const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
const { configAxios } = require("../assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;

const fecha = document.querySelector('#fecha');
const nComprobante = document.querySelector('#nComprobante');
const Rsocial = document.querySelector('#Rsocial');
const concepto = document.querySelector('#concepto');
const importe = document.querySelector('#importe');
const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');

window.addEventListener('load',async e=>{
    const usuarios = (await axios.get(`${URL}usuarios`,configAxios)).data;
    usuarios.sort((a,b)=>{
        if (a.nombre>b.nombre) {
            return 1
        }else if(a.nombre<b.nombre){
            return -1
        }
        return 0;
    })
    for await(let usuario of usuarios){
        const option = document.createElement('option');
        option.value = usuario.nombre;
        option.text = usuario.nombre;
        Rsocial.appendChild(option);

        if (usuario.nombre === "ELBIO") {
            Rsocial.value = usuario.nombre
        }
    }
});

const now = new Date();
let date = now.getDate();
let month = now.getMonth() + 1;
let year = now.getFullYear();

date = date<10 ? `0${date}` : date;
month = month===13 ? 1 : month;
month = month<10 ? `0${month}` : month;

fecha.value = `${year}-${month}-${date}`;


fecha.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        nComprobante.focus();
    }
});

nComprobante.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        Rsocial.focus();
    }
});

Rsocial.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        concepto.focus();
    }
});

concepto.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        importe.focus();
    }
});


importe.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        e.preventDefault();
        agregar.focus();
    }
});

agregar.addEventListener('click',async e=>{
    const vale = {}
    const valorFecha = fecha.value.split('-',3);
    let hora = new Date().getHours();
    let minutos = new Date().getMinutes();
    vale.fecha = new Date(valorFecha[0],valorFecha[1]-1,valorFecha[2],hora,minutos,15);
    vale.rsoc = Rsocial.value;
    vale.concepto = concepto.value.toUpperCase();
    vale.imp = importe.value;
    vale.nro_comp = nComprobante.value;
    vale.tipo = "P";
    try {
        await axios.post(`${URL}vales`,vale,configAxios);
        window.close();
    } catch (error) {
        console.log(error);
        await sweet.fire({
            title:"No se pudo cargar el VALE"
        })
    }
});


salir.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});


nComprobante.addEventListener('focus',e=>{
    nComprobante.select();
});

concepto.addEventListener('focus',e=>{
    concepto.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});