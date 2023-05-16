const axios = require('axios');
const { copiar } = require('../funciones');
require('dotenv').config();
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');
const tbody = document.querySelector('tbody');
const detallesProducto = document.querySelector('.detallesProducto');
const cerrarVentana = document.getElementById('cerrarVentana');
const detalle = document.getElementById('detalle');

let seleccionado;
let subSeleccionado;

window.addEventListener('load',e=>{
    const hoy = new Date();
    const fechaArgentina = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString();
    desde.value = fechaArgentina.slice(0,10);
    hasta.value = fechaArgentina.slice(0,10);

    copiar()
    traerPrestamosAnulados();
});

desde.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        hasta.focus();
        traerPrestamosAnulados();
    }
});

hasta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        traerPrestamosAnulados();
    }
});

cerrarVentana.addEventListener('click',e=>{
    detallesProducto.classList.add('none');
}); 

tbody.addEventListener('click',seleccionarTr);

async function traerPrestamosAnulados() {
    const prestamos = (await axios.get(`${URL}prestamos/anulados/${desde.value}/${hasta.value}`)).data;
    listarPrestamos(prestamos);
};

async function listarPrestamos(lista) {
    tbody.innerText = "";
    for(let prestamo of lista){
        const tr = document.createElement('tr');
        tr.id = prestamo._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNro = document.createElement('td');
        const tdObservaciones = document.createElement('td');
        const tdNroPresupuesto = document.createElement('td');

        const fecha = prestamo.fecha.slice(0,10).split('-',3);

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerText = prestamo.codigo;
        tdCliente.innerText = prestamo.cliente;
        tdNro.innerText = prestamo.nro_comp;
        tdObservaciones.innerText = prestamo.observaciones;
        tdNroPresupuesto.innerText = prestamo.nroPresupuesto;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNro);
        tr.appendChild(tdObservaciones);
        tr.appendChild(tdNroPresupuesto);

        tbody.appendChild(tr);
    };
};

async function seleccionarTr(e) {
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    };

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    PonerMovimientos(seleccionado.children[5].innerText);
};

async function PonerMovimientos(id) {
    const movimientos = (await axios.get(`${URL}movProductos/${id}/Presupuesto`)).data;
    detalle.innerText = "";
    for await(let mov of movimientos){
        const tr = document.createElement('tr');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdPrecio = document.createElement('td');

        tdCodigo.innerText = mov.codProd;
        tdProducto.innerText = mov.descripcion;
        tdCantidad.innerText = mov.egreso;
        tdStock.innerText = mov.stock;
        tdPrecio.innerText = mov.precio_unitario;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdStock);
        tr.appendChild(tdPrecio);

        detalle.appendChild(tr);
    };

    detallesProducto.classList.remove('none');
}

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html'
    }
});