const { ipcRenderer } = require('electron');
const sweet = require('sweetalert2');

const axios = require('axios');
const { configAxios } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const buscador = document.getElementById('buscador');

const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');
const tbody = document.querySelector('tbody');

const porNumero = document.getElementById('porNumero');
const porRazon = document.getElementById('porRazon');


let idCheques = [];

let cheques = [];

let seleccionado;
let subSeleccionado;

window.addEventListener('load', async e =>{
    cheques = (await axios.get(`${URL}cheques`,configAxios)).data;
    listarCheques(cheques);
});

buscador.addEventListener('keyup',e=>{
    if (buscador.value !== "") {
        if (porNumero.checked) {
            const chequesFiltrados = cheques.filter(cheque=> cheque.n_cheque.startsWith(buscador.value))
            listarCheques(chequesFiltrados)
        }else if(porRazon.checked){
            const chequesFiltrados = cheques.filter(cheque=> cheque.ent_por.startsWith(buscador.value.toUpperCase()));
            listarCheques(chequesFiltrados)
        }else{
            const chequesFiltrados = cheques.filter(cheque => cheque.i_cheque?.toString().startsWith(buscador.value));
            listarCheques(chequesFiltrados);
        }
    }else{
        listarCheques(cheques);
    };
});

agregar.addEventListener('click',async e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"./cheques/agregar-modificarCheques.html",
        width:500,
        height:700,
        reinicio:true
    })
});

//Seleccionamos cheques
tbody.addEventListener('click',async e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    }

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    if (e.target.innerHTML === "delete") {
        await sweet.fire({
            title:"Seguro Borrar Cheque?",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}cheques/id/${seleccionado.id}`,configAxios);
                    tbody.removeChild(seleccionado);
                } catch (error) {
                    console.log(error)
                    await sweet.fire({
                        title:"No se pudo borrar el cheque"
                    })
                }
            }
        });
    }else if(e.target.innerHTML === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path:"./cheques/agregar-modificarCheques.html",
            width:500,
            height:700,
            reinicio:false,
            informacion: seleccionado.id
        });
    }
});

const listarCheques = async(cheques)=>{
    tbody.innerHTML = "";
    for await(let {_id,f_recibido,n_cheque,banco,f_cheque,plaza,i_cheque,ent_por,entreg_a,domicilio,telefono,tipo} of cheques){
        const fechaCorta = f_recibido.slice(0,10).split('-',3);
        const fechaCheque = f_cheque ? f_cheque.slice(0,10).split('-',3) : "0000-00-00";
        
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
        const tdDomicilio = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdPropio = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('acciones');

        tdF_recibido.innerHTML = recibido;
        tdNumero.innerHTML = n_cheque;
        tdBanco.innerHTML = banco;
        tdF_cheque.innerHTML = F_cheque;
        tdPLaza.innerHTML = plaza;
        tdImporte.innerHTML = i_cheque;
        tdEntrePor.innerHTML = ent_por;
        tdEntreg_a.innerHTML = entreg_a;
        tdDomicilio.innerHTML = domicilio;
        tdTelefono.innerHTML = telefono;
        tdPropio.innerHTML = tipo;

        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `
        
        tr.appendChild(tdF_recibido);
        tr.appendChild(tdNumero);
        tr.appendChild(tdBanco);
        tr.appendChild(tdPLaza);
        tr.appendChild(tdF_cheque);
        tr.appendChild(tdImporte);
        tr.appendChild(tdEntrePor);
        tr.appendChild(tdEntreg_a);
        tr.appendChild(tdDomicilio);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdPropio);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr)
    }
};

salir.addEventListener('click',async e=>{
    location.href = "../index.html";
});

document.addEventListener('keyup',e=>{
    if(e.keyCode === 27){
        location.href = "../index.html";
    }
});

ipcRenderer.on('recibir-informacion',modificarInputs);

function modificarInputs(e,cheque) {
    const tr = document.getElementById(cheque._id);
    console.log(cheque)
    tr.children[0].innerText = cheque.f_recibido.split('-',3).reverse().join('/');
    tr.children[1].innerText = cheque.n_cheque;
    tr.children[2].innerText = cheque.banco;
    tr.children[3].innerText = cheque.plaza;
    tr.children[4].innerText = cheque.f_cheque.split('-',3).reverse().join('/');;
    tr.children[5].innerText = cheque.i_cheque.toFixed(2);
    tr.children[6].innerText = cheque.ent_por;
    tr.children[7].innerText = cheque.entreg_a;
    tr.children[8].innerText = cheque.domicilio;
    tr.children[9].innerText = cheque.telefono;
    tr.children[10].innerText = cheque.tipo;
}
