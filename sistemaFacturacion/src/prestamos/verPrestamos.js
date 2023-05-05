const axios = require('axios');
require('dotenv');
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const tbody = document.querySelector('tbody');
const detallesProducto = document.querySelector('.detallesProducto');
const detalle = document.getElementById('detalle');
const cerrarVentana = document.getElementById('cerrarVentana');

const botonAnular = document.getElementById('botonAnular');

/* Variables */
let seleccionado = "";
let subSeleccionado = "";

window.addEventListener('load',async e=>{
    const hoy = new Date();
    const fechaArgentina = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString();
    desde.value = fechaArgentina.slice(0,10);
    hasta.value = fechaArgentina.slice(0,10);
    const prestamos = (await axios.get(`${URL}prestamos/betweenDates/${desde.value}/${hasta.value}`)).data;
    listarPrestamos(prestamos);
});

desde.addEventListener('keypress',traerPrestamos);
hasta.addEventListener('keypress',traerPrestamos);
tbody.addEventListener('click',mostrarDetalleProducto);
cerrarVentana.addEventListener('click',closeDetalle);
botonAnular.addEventListener('click',anularPrestamos);

//Mostramos los prestamos que esten en la base de datos sin anular
async function traerPrestamos(e) {
    if (e.keyCode === 13) {
        const prestamos = (await axios.get(`${URL}prestamos/betweenDates/${desde.value}/${hasta.value}`)).data;
        listarPrestamos(prestamos);

        if (e.target.id === "desde") {
            hasta.focus();
        }
    }
};

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
        const tdAnular = document.createElement('td');

        const inputAnular = document.createElement('input');
        inputAnular.setAttribute('type','checkbox');
        inputAnular.id = elem.nro_comp;

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerText = elem.codigo;
        tdCliente.innerText = elem.cliente;
        tdNroComp.innerText = elem.nro_comp;

        tdAnular.appendChild(inputAnular)

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNroComp);
        tr.appendChild(tdAnular);

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
    const movimientos = (await axios.get(`${URL}movProductos/${seleccionado.id}/Prestamo`)).data;
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
async function anularPrestamos() {
  const inputs = document.querySelectorAll('input[type=checkbox]');
  const arrayAAnular = [];

  inputs.forEach(elem=>{
    elem.checked && arrayAAnular.push(elem.id);
  });
  
  await putAPrestamo(arrayAAnular);
  await arreglarStock(arrayAAnular);
  await crearMovimiento(arrayAAnular);

  location.reload();
};

//Modificamos el prestamo poniendo la anulacion en true
async function putAPrestamo(lista) {
    for(let numero of lista){
        let prestamo = (await axios.get(`${URL}prestamos/forNumber/${numero}`)).data;
        prestamo.anulado = true;
        await axios.put(`${URL}prestamos/forNumber/${numero}`,prestamo);
      }
};

//Arregalmos el stock depèndiendo de si suma o se resta para la anulacion
async function arreglarStock(lista) {
  for(let elem of lista){
    const movimientos = (await axios.get(`${URL}movProductos/${elem}/Prestamo`)).data;
    for(let {codProd,egreso} of movimientos){
        const producto = (await axios.get(`${URL}productos/${codProd}`)).data;
        producto.stock = parseFloat(producto.stock) + egreso;
        await axios.put(`${URL}productos/${codProd}`,producto);
    }
  }  
};

//Se crea un movimiento por cada producto que este en los prestamos para informar que se anulo
async function crearMovimiento(lista) {
    let nuevoArreglo = [];
    for(let elem of lista){
        const movimientos = (await axios.get(`${URL}movProductos/${seleccionado.id}/Prestamo`)).data;
        
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
    (await axios.post(`${URL}movProductos`,nuevoArreglo));
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