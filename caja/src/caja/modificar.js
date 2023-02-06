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

let seleccionado;
let subSeleccionado;


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
    const movimientosPasados = movimientos.filter(movimiento => movimiento.pasado === true);

    movimientosPasados.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1
        }else if(a.fecha < b.fecha){
            return -1
        };
        return 0
    });
    
    listar(movimientosPasados);
});

desde.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        const fecha = hasta.value.split('-',3);
        let nextDay = new Date(fecha[0],fecha[1] - 1,fecha[2]);
        nextDay.setDate(nextDay.getDate() + 1);

        const movimientos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}`)).data;
        const movimientosPasados = movimientos.filter(movimiento => movimiento.pasado === true);

        movimientosPasados.sort((a,b)=>{
            if (a.fecha > b.fecha) {
                return 1
            }else if(a.fecha < b.fecha){
                return -1
            };
            return 0
        });

        listar(movimientosPasados);
        hasta.focus();
    }
});

hasta.addEventListener('keypress',async e=>{
    if(e.keyCode === 27){
        const fecha = hasta.value.split('-',3);
        let nextDay = new Date(fecha[0],fecha[1] - 1,fecha[2]);
        nextDay.setDate(nextDay.getDate() + 1);

        const movimientos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}`)).data;
        const movimientosPasados = movimientos.filter(movimiento => movimiento.pasado === true);

        movimientosPasados.sort((a,b)=>{
            if (a.fecha > b.fecha) {
                return 1
            }else if(a.fecha < b.fecha){
                return -1
            };
            return 0
        });

        listar(movimientosPasados);
    }
});

const listar = (lista)=>{
    tbody.innerHTML = "";
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
        const tdACciones = document.createElement('td');
        
        tdACciones.classList.add('acciones');

        const fecha = mov.fecha.slice(0,10).split('-',3)
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdTipo.innerHTML = mov.tMov.slice(0,1);
        tdNumero.innerHTML = mov.nro_comp;
        tdDescripcion.innerHTML = mov.desc;
        tdImporte.innerHTML = mov.imp.toFixed(2);
        tdCuenta.innerHTML = mov.cuenta;
        tdEmpresa.innerHTML = "Electro Avenida";
        tdACciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Editar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

        tr.appendChild(tdFecha);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdImporte);
        tr.appendChild(tdCuenta);
        tr.appendChild(tdEmpresa);
        tr.appendChild(tdACciones);

        tbody.appendChild(tr);
    }
};


tbody.addEventListener('click',async e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if(e.target.nodeName === "TD"){
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

    if (e.target.innerHTML === "edit") {
        ipcRenderer.send('abrir-ventana',({
            path:"./caja/movCaja.html",
            width:800,
            height:500,
            reinicio:true,
            informacion: seleccionado.id
        }))
        
    }else if(e.target.innerHTML === "delete"){
        await sweet.fire({
            title:"Eliminar Movimiento?",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}movCajas/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                } catch (error) {
                    sweet.fire({
                        title:"No se pudo elimar el movimientos"
                    })
                }
            }
        })
    }

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
});

