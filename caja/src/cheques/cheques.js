const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const buscador = document.getElementById('buscador');

const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const borrar = document.querySelector('.borrar');
const salir = document.querySelector('.salir');
const tbody = document.querySelector('tbody');

const porNumero = document.getElementById('porNumero');
const porRazon = document.getElementById('porRazon');


let idCheques = [];

let cheques = [];

let seleccionado;
let subSeleccionado;

window.addEventListener('load', async e =>{
    cheques = (await axios.get(`${URL}cheques`)).data;
    listarCheques(cheques);
});

buscador.addEventListener('keyup',e=>{
    if (porNumero.checked) {
        const chequesFiltrados = cheques.filter(cheque=> cheque.n_cheque.startsWith(buscador.value))
        listarCheques(chequesFiltrados)
    }else if(porRazon.checked){
        const chequesFiltrados = cheques.filter(cheque=> cheque.ent_por.startsWith(buscador.value.toUpperCase()));
        listarCheques(chequesFiltrados)
    }else{
        const chequesFiltrados = cheques.filter(cheque => cheque.i_cheque === parseFloat(buscador.value));
        listarCheques(chequesFiltrados)
    }
});

agregar.addEventListener('click',async e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"./cheques/agregar-modificarCheques.html",
        width:500,
        height:600,
        reinicio:true
    })
})

modificar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"./cheques/agregar-modificarCheques.html",
        width:500,
        height:600,
        reinicio:true,
        informacion: seleccionado.id
    })
});

borrar.addEventListener('click',e=>{
    if (seleccionado) {
        sweet.fire({
            title: "Eliminar Cheque",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}cheques/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado)
                } catch (error) {
                 await sweet.fire({
                    title:"No se pudo borrar el cheque"
                 })   
                }
            }
        })
    }
});

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado')
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado')
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');
});

salir.addEventListener('click',async e=>{
    location.href = "../index.html";
});

const listarCheques = async(cheques)=>{
    tbody.innerHTML = "";
    for await(let {_id,f_recibido,n_cheque,banco,f_cheque,plaza,i_cheque,ent_por,entreg_a} of cheques){
        const fechaCorta = f_recibido.slice(0,10).split('-',3);
        const fechaCheque = f_cheque.slice(0,10).split('-',3);
        
        let recibido = fechaCorta[2] + "/" + fechaCorta[1] + "/" + fechaCorta[0]
        let F_cheque = fechaCheque[2] + "/" + fechaCheque[1] + "/" + fechaCheque[0];

        const tr = document.createElement('tr');
        tr.id = _id;
        //fecha
        const tdF_recibido = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdBanco = document.createElement('td');
        const tdF_cheque = document.createElement('td');
        const tdPLaza = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdEntrePor = document.createElement('td');
        const tdEntreg_a = document.createElement('td');

        tdF_recibido.innerHTML = recibido;
        tdNumero.innerHTML = n_cheque;
        tdBanco.innerHTML = banco;
        tdF_cheque.innerHTML = F_cheque;
        tdPLaza.innerHTML = plaza;
        tdImporte.innerHTML = i_cheque.toFixed(2);
        tdEntrePor.innerHTML = ent_por;
        tdEntreg_a.innerHTML = entreg_a;
        
        tr.appendChild(tdF_recibido);
        tr.appendChild(tdNumero);
        tr.appendChild(tdBanco);
        tr.appendChild(tdPLaza);
        tr.appendChild(tdF_cheque);
        tr.appendChild(tdImporte);
        tr.appendChild(tdEntrePor);
        tr.appendChild(tdEntreg_a);

        tbody.appendChild(tr)
    }
}