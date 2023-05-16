const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const {cerrarVentana, redondear} = require('../assets/js/globales')

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

let cerrar = false;
let bandera = false;

const f_entrega = document.getElementById('f_entrega');
const n_cheque = document.getElementById('n_cheque');
const banco = document.getElementById('banco');
const plaza = document.getElementById('plaza');
const f_cheque = document.getElementById('f_cheque');
const i_cheque = document.getElementById('i_cheque');
const ent_por = document.getElementById('ent_por');
const entre_a = document.getElementById('entre_a');
const domicilio = document.getElementById('domicilio');
const telefono = document.getElementById('telefono');
const propio = document.getElementById('propio');

const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');


const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}`: day;
month = month < 10 ? `0${month}`: month;

window.addEventListener('load',e=>{
    cerrarVentana();
    f_entrega.value = `${year}-${month}-${day}`;
    f_cheque.value =  `${year}-${month}-${day}`;
});

agregar.addEventListener('click',async e=>{
    const cheque = {};
    cheque.f_recibido = f_entrega.value;
    cheque.n_cheque = n_cheque.value;
    cheque.banco = banco.value.toUpperCase();
    cheque.plaza = plaza.value.toUpperCase();
    cheque.f_cheque = f_cheque.value;
    cheque.i_cheque = i_cheque.value;
    cheque.ent_por = ent_por.value.toUpperCase();
    cheque.entreg_a = entre_a.value.toUpperCase();
    cheque.domicilio = domicilio.value.toUpperCase();
    cheque.telefono = telefono.value;
    cheque.tipo = propio.checked ? "P" : "";
    
    try {
        await axios.post(`${URL}cheques`,cheque);
        await sweet.fire({
            title:"Otro Cheque?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        })
        .then(({isConfirmed})=>{
            if (isConfirmed) {
                n_cheque.value = "";
                banco.value = "";
                plaza.value = "";
                i_cheque.value = "";
                domicilio.value = "";
                telefono.value = "";
                n_cheque.focus();    
                bandera = true;
            }else{
                if (cerrar) {
                    ipcRenderer.send('enviar-info-ventana-principal',"Cheque cargado")
                }    
                window.close();
            }
            
        
        });
    } catch (error) {
        console.log(error)
    await sweet.fire({
            title:"No se pudo agregar Cheque"
        })
        
    }
});

modificar.addEventListener('click',async e=>{
    const cheque = {};

    cheque.f_recibido = f_cheque.value;
    cheque.n_cheque = n_cheque.value;
    cheque.banco = banco.value.toUpperCase();
    cheque.plaza = plaza.value.toUpperCase();
    cheque.f_cheque = f_cheque.value;
    cheque.i_cheque = i_cheque.value;
    cheque.ent_por = ent_por.value.toUpperCase();
    cheque.entreg_a = entre_a.value.toUpperCase();
    cheque.domicilio = domicilio.value.toUpperCase();
    cheque.telefono = telefono.value;
    cheque.tipo = propio.checked ? "P" : "";
    
    try {
        await axios.put(`${URL}cheques/id/${modificar.id}`,cheque);
        window.close();
    } catch (error) {
        await sweet.fire({
            title:"No se pudo modifacar la venta"
        })
    }
});

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    agregar.classList.add('none');
    modificar.classList.remove('none');
    modificar.id = args;
    const cheque = (await axios.get(`${URL}cheques/id/${args}`)).data;
    listarCheque(cheque)
});

//Aca hacemos que cuando queremos agregar un cheque desde cobranza y facturas se llame a la funcion
ipcRenderer.on('informacionAgregar',cobranzaDeCheques);

//La funcion lo que hace es autocompletar algunos inputs y tambien sacar el entregado a
function cobranzaDeCheques(e,{cliente,imp,vendedor}) {
    entre_a.parentNode.classList.add('none');
    propio.parentNode.classList.add('none');

    ent_por.value = cliente,
    i_cheque.value = imp
}

function listarCheque(cheque) {
    const fechaEntrega = cheque.f_recibido.slice(0,10).split('-',3);
    const fechaCheque =  cheque.f_cheque.slice(0,10).split('-',3);
    console.log(fechaCheque)

    f_entrega.value = `${fechaEntrega[0]}-${fechaEntrega[1]}-${fechaEntrega[2]}`
    n_cheque.value = cheque.n_cheque;
    banco.value = cheque.banco;
    plaza.value = cheque.plaza;
    f_cheque.value = `${fechaCheque[0]}-${fechaCheque[1]}-${fechaCheque[2]}`
    i_cheque.value = redondear(cheque.i_cheque,2);
    ent_por.value = cheque.ent_por;
    entre_a.value = cheque.entreg_a;
    domicilio.value = cheque.domicilio;
    telefono.value = cheque.telefono;
}

ipcRenderer.on('cerrar-ventana',(e,args)=>{
    cerrar = args;
})

salir.addEventListener('click',e=>{
    if (cerrar && bandera) {
        ipcRenderer.send('enviar-info-ventana-principal',"Cheque cargado")
    }
    window.close();
});

f_entrega.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        n_cheque.focus();    
    }
});

n_cheque.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        banco.focus();    
    }
});

banco.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        plaza.focus();    
    }
});

plaza.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        f_cheque.focus();    
    } 
});

f_cheque.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        i_cheque.focus();    
    }
});

i_cheque.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        ent_por.focus();    
    }
});

ent_por.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (entre_a.parentNode.classList.contains('none')) {
            domicilio.focus();
        }else{
            entre_a.focus();
        }
    }
});

entre_a.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        domicilio.focus();    
    }
});

domicilio.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        telefono.focus();    
    }
});

telefono.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (agregar.classList.contains('none')) {
            modificar.focus();
        }else{
            agregar.focus();
        }
    }
});

n_cheque.addEventListener('focus',e=>{
    n_cheque.select();
});

banco.addEventListener('focus',e=>{
    banco.select();
});

plaza.addEventListener('focus',e=>{
    plaza.select();
});

i_cheque.addEventListener('focus',e=>{
    i_cheque.select();
});

ent_por.addEventListener('focus',e=>{
    ent_por.select();
});

entre_a.addEventListener('focus',e=>{
    entre_a.select();
});

domicilio.addEventListener('focus',e=>{
    domicilio.select();
});

telefono.addEventListener('focus',e=>{
    telefono.select();
});