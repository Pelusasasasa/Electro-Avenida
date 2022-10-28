const sweet = require('sweetalert2');
const axios = require("axios");
const { ipcRenderer } = require("electron");
require("dotenv").config;
const URL = process.env.URL;

const{ cerrarVentana, botonesSalir} = require('../funciones')

const numeroCheque = document.querySelector('#numeroCheque');
const banco = document.querySelector('#banco');
const fechaCheque = document.querySelector('#fechaCheque');
const importe = document.querySelector('#importe');
const entregadoPor = document.querySelector('#entregadoPor');
const usuario = document.querySelector('#usuario');
const domicilio = document.querySelector('#domicilio');
const telefono = document.querySelector('#telefono');
const agregar = document.querySelector('.agregar');

window.addEventListener('load',e=>{
    cerrarVentana();
    botonesSalir();
});


ipcRenderer.on('informacion',(e,args)=>{
    const {imp,vendedor,loc,dom,cliente,tel} = JSON.parse(args);
    importe.value = imp;
    telefono.value = tel;
    entregadoPor.value = cliente;
    domicilio.value = dom + " - " + loc;
    usuario.value = vendedor
})

numeroCheque.addEventListener('keypress',async e=>{
    if(e.key === "Enter" && numeroCheque.value.length === 8){
        banco.focus();
    }else if(e.key === "Enter" && numeroCheque.value.length !== 8){
        await sweet.fire({
            title:"Numero del cheque no valido",
            returnFocus:false
        });
        numeroCheque.focus();
    }
});

banco.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        fechaCheque.focus();
    }
});

fechaCheque.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        importe.focus();
    }
});

importe.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        entregadoPor.focus();
    }
});

entregadoPor.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        domicilio.focus();
    }
});

domicilio.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        telefono.focus();
    }
});

telefono.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        agregar.focus();
    }
});


numeroCheque.addEventListener('focus',e=>{
    numeroCheque.select();
});


banco.addEventListener('focus',e=>{
    banco.select();
});

fechaCheque.addEventListener('focus',e=>{
    fechaCheque.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});

entregadoPor.addEventListener('focus',e=>{
    entregadoPor.select();
});

domicilio.addEventListener('focus',e=>{
    domicilio.select();
});

telefono.addEventListener('focus',e=>{
    telefono.select();
});


agregar.addEventListener('click',async e=>{
    const cheque = {};
    cheque.n_cheque = numeroCheque.value;
    cheque.banco = banco.value;
    cheque.f_cheque = fechaCheque.value;
    cheque.i_cheque = importe.value;
    cheque.ent_por = entregadoPor.value;
    cheque.vendedor = usuario.value;
    cheque.dom = domicilio.value;
    cheque.tel = telefono.value;
    console.log(cheque)
    await axios.post(`${URL}cheques`,cheque);
    await sweet.fire({
        title:"Otro Cheque?",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(({value})=>{
        if (value) {
            location.reload()
        }else{
            window.close();
        }
    })
});
