const { ipcRenderer,clipboard } = require("electron");

const axios = require('axios');
const { copiar,redondear } = require("../assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

const tbody = document.querySelector('.tbody');

const buscador = document.querySelector('#buscador');
const totalInput = document.querySelector('#total');

const agregar = document.querySelector('.agregar');
const salir = document.querySelector('.salir');

let total = 0;
let tarjetas = [];
let seleccionado
let subSeleccionado


window.addEventListener('load',async e=>{
    copiar();
    tarjetas = (await axios.get(`${URL}tarjetas`)).data;
    listar(tarjetas);
});

buscador.addEventListener('keyup',e=>{
    listar(tarjetas.filter(tarjeta => tarjeta.tarjeta.startsWith(buscador.value.toUpperCase())))
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"./tarjetas/agregarTarjeta.html",
        width:500,
        height:600,
        reinicio:true
    });
});

tbody.addEventListener('click',async e=>{
    if (e.target.nodeName !== "TBODY") {
        seleccionado && seleccionado.classList.remove('seleccionado')
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        if (e.target.nodeName === "TD") {
            seleccionado = e.target.parentNode;
            subSeleccionado = e.target;
        }else if(e.target.nodeName === "DIV"){
            seleccionado = e.target.parentNode.parentNode;
            subSeleccionado = e.target.parentNode;
        }else if(e.target.nodeName === "SPAN"){
            seleccionado = e.target.parentNode.parentNode.parentNode;
            subSeleccionado = e.target.parentNode.parentNode
        }

        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');


        if (e.target.innerHTML === "delete") {
            await sweet.fire({
                title:"Seguro que quiere eliminar",
                showCancelButton:true,
                confirmButtonText: "Aceptar"
            }).then(async ({isConfirmed})=>{
                if (isConfirmed) {
                    try {
                        totalInput.value = redondear(parseFloat(totalInput.value) - parseFloat(seleccionado.children[2].innerHTML),2)
                        await axios.delete(`${URL}tarjetas/id/${seleccionado.id}`);
                        tbody.removeChild(seleccionado)
                    } catch (error) {
                        await sweet.fire({
                            title:"No se pudo borrar"
                        });
                    }
                }
            });
        }else if (e.target.innerHTML === "edit") {
            ipcRenderer.send('abrir-ventana',{
                path:"./tarjetas/agregarTarjeta.html",
                width:500,
                height:600,
                reinicio:true,
                informacion: seleccionado.id
            });
        }
    }
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        location.href = '../index.html';
    }
});

const listar = async(tarjetas)=>{
    tarjetas.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return -1;
        }else if(a.fecha<b.fecha){
            return 1;
        }
        return 0;
    })
    .sort((a,b)=>{
        return a.tarjeta>b.tarjeta ? 1 : -1;
    });

    tbody.innerHTML = "";
    for await(let tarjeta of tarjetas){
        const tr = document.createElement('tr');
        tr.id = tarjeta._id;

        const tdFecha = document.createElement('td');
        const tdTarjeta = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdAcciones = document.createElement('td');

        const fecha = tarjeta.fecha.slice(0,10).split('-',3);
        
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`
        tdTarjeta.innerHTML = tarjeta.tarjeta;
        tdImporte.innerHTML = (tarjeta.imp).toFixed(2);
        tdVendedor.innerHTML = tarjeta.vendedor;
        tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div id=delete class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

        tdAcciones.classList.add('acciones');
        total += tarjeta.imp;

        tr.appendChild(tdFecha);
        tr.appendChild(tdTarjeta);
        tr.appendChild(tdImporte);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdAcciones)

        tbody.appendChild(tr)
    }
    totalInput.value = total.toFixed(2);
};