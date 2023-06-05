const axios = require('axios');
const { ipcRenderer } = require('electron');
const { configAxios } = require('../funciones');
require('dotenv');
const URL = process.env.URL;

const tbody = document.querySelector('tbody');
const detallesProducto = document.querySelector('.detallesProducto');
const detalle = document.getElementById('detalle');
const cerrarVentana = document.getElementById('cerrarVentana');

const botonFacturar = document.getElementById('botonFacturar');

/* Variables */
let seleccionado = "";
let subSeleccionado = "";

window.addEventListener('load',async e=>{
    const hoy = new Date();
    const prestamos = (await axios.get(`${URL}prestamos`,configAxios)).data;
    listarPrestamos(prestamos);
});

tbody.addEventListener('click',mostrarDetalleProducto);
cerrarVentana.addEventListener('click',closeDetalle);
botonFacturar.addEventListener('click',facturarPrestamos);

//Listamos los prestamos traidos
async function listarPrestamos(lista) {
    tbody.innerText = "";
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem.nro_comp;

        const fecha = elem.fecha.slice(0,10).split('-',3);

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNroComp = document.createElement('td');
        const tdObservaciones = document.createElement('td');
        const tdFacturar = document.createElement('td');

        const inputAnular = document.createElement('input');
        inputAnular.setAttribute('type','checkbox');
        inputAnular.id = elem.nro_comp;

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerText = elem.codigo;
        tdCliente.innerText = elem.cliente;
        tdNroComp.innerText = elem.nro_comp;
        tdObservaciones.innerText = elem.observaciones;

        tdFacturar.appendChild(inputAnular)

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNroComp);
        tr.appendChild(tdObservaciones);
        tr.appendChild(tdFacturar);

        tbody.appendChild(tr);
    }
};

//si se hace un click en el prestamo se traen los moviminetos de producto
async function mostrarDetalleProducto(e){
    detallesProducto.classList.remove('none');

    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    /*Traer movimientos*/;
    const movimientos = (await axios.get(`${URL}movProductos/${seleccionado.id}/Prestamo`,configAxios)).data;
    console.log(movimientos)
    listarMovimientos(movimientos);
};

//Listamos los movimientos de productos
async function listarMovimientos(lista) {
    detalle.innerText = "";
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdPrecio = document.createElement('td');


        tdCodigo.innerText = elem.codProd;
        tdDescripcion.innerText = elem.descripcion;
        tdCantidad.innerText = elem.egreso.toFixed(2);
        tdStock.innerText = elem.stock.toFixed(2);
        tdPrecio.innerText = elem.precio_unitario;

        tdCantidad.classList.add('text-end');
        tdStock.classList.add('text-end');
        tdPrecio.classList.add('text-end');

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdStock);
        tr.appendChild(tdPrecio);

        detalle.appendChild(tr);

    }
};

//Cerramos el section de detalle si apretamos escape o hacemos click en la cruz
function closeDetalle() {
    detallesProducto.classList.add('none');
};

//Anulamos el prestamo
async function facturarPrestamos() {
  const inputs = document.querySelectorAll('input[type=checkbox]');
  const arrayAFacturar = [];

  inputs.forEach(elem=>{
    elem.checked && arrayAFacturar.push(elem.id);
  });
  location.href = `../emitirComprobante/emitirComprobante.html?facturarPrestamo=${true}&arregloPrestamo=${JSON.stringify(arrayAFacturar)}&observaciones=${seleccionado.children[4].innerText}`;
  ipcRenderer.send('facturar-prestamos',JSON.stringify(arrayAFacturar));
};

//Modificamos el prestamo poniendo la anulacion en true
async function putAPrestamo(lista) {
    for(let numero of lista){
        let prestamo = (await axios.get(`${URL}prestamos/forNumber/${numero}`,configAxios)).data;
        prestamo.anulado = true;
        await axios.put(`${URL}prestamos/forNumber/${numero}`,prestamo);
      }
};

//Arregalmos el stock depèndiendo de si suma o se resta para la anulacion
async function arreglarStock(lista) {
  for(let elem of lista){
    const movimientos = (await axios.get(`${URL}movProductos/${elem}/Prestamo`,configAxios)).data;
    for(let {codProd,egreso} of movimientos){
        const producto = (await axios.get(`${URL}productos/${codProd}`,configAxios)).data;
        producto.stock = parseFloat(producto.stock) + egreso;
        await axios.put(`${URL}productos/${codProd}`,producto,configAxios);
    }
  }  
};

//Se crea un movimiento por cada producto que este en los prestamos para informar que se anulo
async function crearMovimiento(lista) {
    let nuevoArreglo = [];
    for(let elem of lista){
        const movimientos = (await axios.get(`${URL}movProductos/${seleccionado.id}/Prestamo`,configAxios)).data;
        
        for(let mov of movimientos){
            console.log(mov)
            const movimiento = {};
            movimiento.codCliente = mov.codCliente;
            movimiento.cliente = mov.cliente;
            movimiento.codProd = mov.codProd;
            movimiento.descripcion = mov.descripcion;
            movimiento.fecha = new Date();
            movimiento.nro_comp = "0000-00000000";
            movimiento.tipo_comp = "Anulacion";
            movimiento.tipo_pago = "AN";
            movimiento.ingreso = mov.egreso;
            movimiento.stock = mov.stock + mov.egreso ;
            movimiento.precio_unitario = mov.precio_unitario;
            movimiento.total = mov.total;
            nuevoArreglo.push(movimiento);
        };
    };
    (await axios.post(`${URL}movProductos`,nuevoArreglo,configAxios));
};

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        if (!detallesProducto.classList.contains('none')) {
            detallesProducto.classList.add('none')
        }else{
            location.href = '../index.html';
        }
    }
});