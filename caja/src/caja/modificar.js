const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;
const sweet = require('sweetalert2');

const tbody = document.querySelector('tbody');
const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');

const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');


window.addEventListener('load',async e=>{
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;

    const movimientos = (await axios.get(`${URL}movCajas`)).data;
    listar(movimientos);
});

const listar = (lista)=>{
    for(let mov of lista){
        const tr = document.createElement('tr');
        tr.id = mov._id;

        const tdFecha = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdCuenta = document.createElement('td');
        const tdEmpresa = document.createElement('td');

        tdFecha.setAttribute("contenteditable",'');
        tdTipo.setAttribute("contenteditable",'');
        tdNumero.setAttribute("contenteditable",'');
        tdDescripcion.setAttribute("contenteditable",'');
        tdCuenta.setAttribute("contenteditable",'');
        tdImporte.setAttribute("contenteditable",'');
        tdEmpresa.setAttribute("contenteditable",'');

        const fecha = mov.fecha.slice(0,10).split('-',3)
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdTipo.innerHTML = mov.tMov.slice(0,1);
        tdNumero.innerHTML = mov.nro_comp;
        tdDescripcion.innerHTML = mov.desc;
        tdImporte.innerHTML = mov.imp.toFixed(2);
        tdCuenta.innerHTML = mov.cuenta;
        tdEmpresa.innerHTML = "Electro Avenida";


        tr.appendChild(tdFecha);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdImporte);
        tr.appendChild(tdCuenta);
        tr.appendChild(tdEmpresa);



        tbody.appendChild(tr);
    }
};


tbody.addEventListener('keydown',e=>{
    console.log(e.target.innerHTML)
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"caja/movCaja.html",
        wodth:500,
        height:500,
        reinicio:true
    })
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html';
    }
})